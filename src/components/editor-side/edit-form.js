import React, { Fragment } from "react";
import {connect} from 'react-redux';
import produce from 'immer';

import Thumbnails from '../multi-side/thumbnails';
import {InlineClick} from '../multi-side/clickables';
import FileAndUrlInput from './file-url-input'
import {API_BASE_URL} from '../../config';
import Autocomplete from './autocomplete';
import Categories from './categories';
import TagsInput from './tags-input';
import {normalizeResponseErrors} from '../../actions/utils';
import {editContentInState} from '../../actions/content/editor-side';
import {renderValidationWarnings, renderAsyncState} from '../multi-side/user-feedback.js'
import './edit-form.css'

const initialState =   {
    uploadForm: {
      artistName: '',
      title: '',
      description: '',
      category: {
        media: false,
        performance: false,
        text: false
        },
      tags: [],
    },
    thumbnailUrls: [],
    validation: '',
    asyncCall: {
      loading: false,
      success: null
    }
};

//performs async PATCH request
//renders an "editor form" that is just one input field, depending on which value
//(artistName, title, category, tags, files) the user wants to edit
export class EditorEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = produce(initialState, draftState => {
      draftState.uploadForm.files = {
        totalFiles: props.content.files.length,
        filesEdits: props.content.files
      }
    })
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileOrUrlRemove = this.handleFileOrUrlRemove.bind(this);
    this.handleFileOrUrlAdd = this.handleFileOrUrlAdd.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
  }

  componentDidMount(){
    const thumbnailUrls = this.props.content.files.map(e => {
      const {fileUrl, fileName} = e; //if it's a video, it will have fileUrl, otherwise it will have fileId
      const thumbnail = fileUrl? {fileType: e.fileType, fileUrl} : {fileType: e.fileType, fileName};
      return thumbnail;
    })
    this.setState(produce(draft => {
      draft.uploadForm.files = {
        totalFiles: this.props.content.files.length,
        filesEdits: this.props.content.files
      }
      draft.thumbnailUrls = thumbnailUrls;
    }))
  }

  patchEntry(data, field) {
    const asyncCall = {loading: true, success: null};
    this.setState({asyncCall});
    let body, headers;
    if(field === 'files') {
      headers = {
        Authorization : `Bearer ${this.props.authToken}`
      };
      body = data;
    } else {
      headers = {
        'Content-Type': 'application/json',
        Authorization : `Bearer ${this.props.authToken}`
      };
      body = JSON.stringify(data);
    }
    fetch(`${API_BASE_URL}/protected/${field}/${this.props.content.id}`, {
      method: 'PATCH',
      headers: headers,
      body: body
    })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then(editedDoc => {
      const asyncCall = {loading: false, success: true};
    //if successful, editContentInState called to update the browser state with edited document
     this.props.dispatch(editContentInState(this.props.content.id, editedDoc))
       .then(() => {
         const files = {
           totalFiles: this.props.content.files.length,
           filesEdits: this.props.content.files
         };
         this.setState(
           produce(initialState, draft => {
             draft.asyncCall = asyncCall;
             draft.uploadForm.files = files;
           })
         )
         this.props.onPatchCompletion();
       })
    })
    .catch(err => {
      this.setState(
        produce(initialState, draft => {
          draft.asyncCall = {loading: false, success: false}
        })
      )
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const upload = this.state.uploadForm;
    const key = this.props.name;
    let data;
    let validation;
    console.log('doing handleSubmit() and the state is', upload.files);
    if (key === 'files') {
      let totalFiles = upload.files.totalFiles; //for validation, to ensure that there is at least 1 file for this entry
      if (totalFiles < 1) { //validation check to make sure field isn't empty
        validation = 'The content has to have at least one file';
      }
      let filesEdit = [];
      let totalEdits = 0; //for validation, to ensure that there is at least one edit being submitted
      upload.files.filesEdits.forEach(e => {
        if (e.remove) { //the user wants to remove one of the files in the db
          filesEdit.push(e._id);
          ++totalEdits;
        } else if (!e.remove && !e._id){  //the file isn't already in the db, so it tells the server to upload it
          filesEdit.push(e.file);
          ++totalEdits;
        }
      })
      if (totalEdits < 1) {
        validation = 'You can\'t submit an edit request without any edits';
      }
      if (validation) {
        this.setState({validation: validation});
      } else {
        console.log('you chose to submit a files edit, and your submitting the following filesEdit array', filesEdit, 'and you have the following totalFiles', totalFiles);
        data = new FormData();
        filesEdit.forEach(e => {
          data.append('files', e);
        });
        this.patchEntry(data, 'files');
      }
    } else {
      if (key === 'tags') {
        if (upload.tags.length < 1) { //validation check to make sure field isn't empty
          validation = 'The content has to have at least one tag';
        } else {
          data = {};
          data[key] = upload.tags;
        }
      } else if (key === 'category') {
        let categoryEdit = [];
        for (let key in upload.category) {
          if (upload.category[key] === true) {
            categoryEdit.push(key);
          };
        }
        if (categoryEdit.length < 1) {  //validation check to make sure field isn't empty
           validation ='The content has to have at least one category';
         } else {
           data = {};
           data[key] = categoryEdit;
         }
      } else { //the value is a string (either artistName or title)
        if (!upload[key]) {  //validation check to make sure field isn't empty
           validation = `You can't submit an empty ${key} field`;
         } else {
           data = {};
           data[key] = upload[key];
         }
      }
      if (validation) {
        this.setState({validation: validation});
      } else {
        this.patchEntry(data, 'content');
      }
    }
  }

  handleCheckBoxChange(event) {
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      event.target.checked ? draft.uploadForm.category[event.target.key] = true : draft.uploadForm.category[event.target.key] = false;
    }));
  }

//the react-tags component handles input change and tag suggestions internally, so
//handleTagSubmit is only called when a full tag string is submitted to this state
  handleTagSubmit(tags) {
    const uploadForm = Object.assign({}, this.state.uploadForm);
    uploadForm.tags = tags;
    this.setState({uploadForm})
  }

  handleFileOrUrlAdd(fileOrUrl){
    console.log('filesOrUrl being passed to handleFileOrUrlAdd is', fileOrUrl)
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      draft.thumbnailUrls.push(fileOrUrl);
      draft.uploadForm.files.filesEdits.push(fileOrUrl);
      ++draft.uploadForm.files.totalFiles;
    }));
  }

  handleFileOrUrlRemove(index){
    console.log('index being passed to handleFileOrUrlRemove is', index)
    this.setState(produce(draft => {
      const selectedFile = draft.uploadForm.files.filesEdits[index];
      if (selectedFile._id) {//the file is already in database
        selectedFile.remove = true;
      } else if (selectedFile.file) {//the file was just uploaded
        draft.uploadForm.files.filesEdits.splice(index, 1);
      }
      --draft.uploadForm.files.totalFiles;
      draft.thumbnailUrls.splice(index, 1)
    }));
  }

  handleTextInput(event) {
    const input = event.currentTarget;
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      draft.uploadForm[input.name] = input.value;
    }))
  }

  renderEditField(){
    //console.log('reached renderEditField()');
    if ((!(this.state.asyncCall.loading)) && (this.state.asyncCall.success === null)) {
      if (this.props.name === 'artistName') {
        return (
          <Autocomplete
            className={this.props.name}
            placeholder={this.props.placeholder}
            suggestions={this.props.suggestedArtists}
            name="artistName"
            value={this.state.uploadForm.artistName}
            onChange={this.handleTextInput}
            noValidate
          />
        )
      } else if (this.props.name === 'title') {
        return (
          <input
            name="title"
            placeholder={this.props.placeholder}
            type="text"
            value={this.state.uploadForm.title}
            onChange={this.handleTextInput}
            noValidate
          />
        )
      } else if (this.props.name === 'description') {
        return (
          <textarea
            rows="3"
            name="description"
            placeholder={this.props.placeholder}
            type="text"
            value={this.state.uploadForm.description}
            onChange={this.handleTextInput}
            noValidate
          />
        )
      } else if (this.props.name === 'category') {
        return(
          <Categories
            categories={this.state.uploadForm.category}
            onChange={this.handleCheckBoxChange}
          />
        )
      } else if (this.props.name === 'tags') {
        return(
          <TagsInput
            name={this.props.name}
            type="text"
            value={this.state.uploadForm.tags}
            label={this.props.label}
            tags={this.state.uploadForm.tags}
            suggestions={this.props.suggestedTags}
            noValidate
            onAddOrDelete={tags => this.handleTagSubmit(tags)}
          />
        )
      } else if (this.props.name === 'files') {
        return(
          <Fragment>
            <FileAndUrlInput
              onFileOrUrlAdd={(fileOrUrl) => this.handleFileOrUrlAdd(fileOrUrl)}
              onFileValidation={files => {
                this.setState(produce(draft => {
                  draft.validation = files;
                }))
              }}
              onUrlValidation={url => {
                this.setState(produce(draft => {
                  draft.validation = url;
                }))
              }}
            />
            <Thumbnails
              thumbnailUrls={this.state.thumbnailUrls}
              handleRemoveClick={this.handleFileOrUrlRemove}
              gallery={false}
              autoplay={0}
            />
          </Fragment>
        )
      }
    }
  }

  render() {
    //console.log('rendering edit form');
    return (
      <section
        id="editor-edit"
        className = 'editForm'
        >
        <div className='edit-form'>
          <InlineClick
            className='clickable exit material-icons'
            onClick={this.props.onExit}
            glyph='close'
          />
          <InlineClick
            className='submit-edit clickable material-icons'
            onClick={this.handleSubmit}
            glyph='mail'
          />
        {renderValidationWarnings(this.state.validation)}
        {renderAsyncState(this.state.asyncCall, 'edit')}
        {this.renderEditField()}
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.authToken,
  suggestedArtists: state.editorContent.suggestedArtists,
  suggestedTags: state.editorContent.suggestedTags
});

export default connect(mapStateToProps)(EditorEditForm);
