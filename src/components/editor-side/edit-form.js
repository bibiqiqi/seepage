import React, { Fragment } from "react";
import {connect} from 'react-redux';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import * as classnames from 'classnames';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {normalizeResponseErrors} from '../../actions/utils';
import {editContentInState, fetchThumbNailsSuccess, arrayBufferToBase64} from '../../actions/content';

import {API_BASE_URL} from '../../config';
import Autocomplete from './autocomplete';
import Categories from './categories';
import LabeledInput from '../labeled-input-controlled';
import TagsInput from './tags-input';
import RenderDropZone from './dropzone';

const initialState = {
  uploadForm: {},
  asyncCall: {
    loading: false,
    success: null
  },
  validationError: false,
}

class EditorEditForm extends React.Component {
  //renders an "editor form" that is just one input field, depending on which value (artistName, title, category, tags, files) the user wants to edit
  //performs async PATCH request
  //props passed from EditorFindRequest:
  // contentId={this.state.contentId}
  // onExit={this.handleEditFormExit}
  // name={field}
  // onPatchCompletion={this.handlePatchCompletion}
  // placeholder={renderedValue}
  // label={string}
  constructor(props) {
    super(props);
    this.state = merge(
      cloneDeep(initialState),
      {
        uploadForm: {
          artistName: '',
          title: '',
          category: {
            media: false,
            performance: false,
            text: false
            },
          files: {
            totalFiles: this.props.thumbNails.length,
            filesEdits: this.props.thumbNails
          },
          tags: []
        }
      }
    );
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  patchEntry(data, field) {
    console.log('running patchEntry');
    const asyncCall = {
      loading: true,
      success: null
    };
    this.setState({asyncCall}, () => {console.log('patch request is happening and now state is:', this.state.asyncCall)});
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
    fetch(`${API_BASE_URL}/protected/${field}/${this.props.contentId}`, {
      method: 'PATCH',
      headers: headers,
      body: body
    })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then(data => {
      //debugger;
      const asyncCall = {
        loading: false,
        success: true
      }
      if(Array.isArray(data)) { //you edited a file, so current thumbNails in state need to be updated
       const base64Flag = 'data:image/jpeg;base64, ';
       const thumbNails = data.map((e) => {
         const thumbNail = {};
         thumbNail.id = e._id;
         const imageStr = arrayBufferToBase64(e.data.data);
         thumbNail.src = base64Flag + imageStr;
         return thumbNail
       });
       this.props.dispatch(fetchThumbNailsSuccess(thumbNails));
       this.setState({asyncCall}, () => {console.log('patch was successful and now local state is:', this.state.asyncCall)});
       this.props.onPatchCompletion();
     } else { //you edited a field, so content in state needs to be updated
       this.props.dispatch(editContentInState(this.props.contentId, data))
         .then(resolve => {
           this.setState({asyncCall}, () => {console.log('patch was successful and now local state is:', this.state.asyncCall)});
           this.props.onPatchCompletion();
         })
     }
    })
    .catch(err => {
      const asyncCall = {
        loading: false,
        success: false
      };
      this.setState({asyncCall}, () => {console.log('patch wasnt successful and now state is:', this.state.asyncCall)});
    })
  }

  handleSubmit(event) {
    //debugger;
    event.preventDefault();
    const upload = this.state.uploadForm;
    const key = this.props.name;
    let data;
    console.log('doing handleSubmit() and the state is', upload.files);
    if (key === 'files') {
      let totalFiles = upload.files.totalFiles; //for validation, to ensure that there is at least 1 file for this entry
      let filesEdit = [];
      let totalEdits = 0;
      upload.files.filesEdits.forEach(e => {
        if (e.file) {  //the file isn't already in the db, so it tells the server to upload it
          filesEdit.push(e.file);
          ++totalFiles;
          ++totalEdits;
        } else if((e.id) && (!e.remove)){
          ++totalFiles;
        } else if (e.id && e.remove) { //the user wants to remove one of the files in the db
          filesEdit.push(e.id);
          --totalFiles;
          ++totalEdits;
        }
      })
      console.log('you chose to submit a files edit, and your submitting the following filesEdit array', filesEdit, 'and you have the following totalFiles', totalFiles);
      if (totalFiles < 1) { //validation check to make sure field isn't empty
        toast.warn('The content has to have at least one file');
      } else if (totalEdits < 1) {
        toast.warn('You can\'t submit an edit request without any edits');
      } else {
        //debugger;
        data = new FormData();
        filesEdit.forEach(e => {
          data.append('files', e);
        });
        this.patchEntry(data, 'files');
      }
    } else {
      if (key === 'tags') {
        if (upload.tags.length < 1) { //validation check to make sure field isn't empty
          this.setState({validationError: true});
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
           this.setState({validationError: true});
         } else {
           data = {};
           data[key] = categoryEdit;
         }
      } else { //the value is a string (either artistName or title)
        if (!upload[key]) {  //validation check to make sure field isn't empty
           this.setState({validationError: true});
         } else {
           data = {};
           data[key] = upload[key];
         }
      }
      if (this.state.validationError) {
        toast.error('You can\'t submit a blank field')
      } else {
        //debugger;
        this.patchEntry(data, 'content');
      }
    }
  }

  //performing validation on field input before it's submitted
  handleChange(event) {
    //debugger;
    console.log('handleChange happening');
    this.setState({validationError: false});
    const uploadForm = cloneDeep(this.state.uploadForm);
    if (!(event.target)) {
      const file = {
        src: URL.createObjectURL(event[0]),
        file: event[0]
      };
      uploadForm.files.filesEdits.push(file);
      ++uploadForm.files.totalFiles;
      this.setState({uploadForm}, () => {console.log('handleChange updated the state and now its:', this.state.uploadForm)});
    } else { //otherwise the change came from either a text input or a checkbox input
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") {
        const checkValue = event.target.checked ? 'checked' : 'unchecked';
        console.log('you', checkValue, key);
        //if input is checkbox, then update value to either true or false
        event.target.checked ? uploadForm.category[key] = true : uploadForm.category[key] = false;
        this.setState({uploadForm}, () => {console.log('handleChange() ran and the updated state is:', this.state.uploadForm)});
      } else {
        //otherwise input is a text value, so update the state with current string
        //debugger;
        uploadForm[key] = value;
        this.setState({uploadForm}, () => {console.log('handleChange updated the state and now its:', this.state.uploadForm)});
      }
    }
  }

//the react-tags component handles input change and tag suggestions internally, so
//handleTagSubmit is only called when a full tag string is submitted to this state
  handleTagSubmit(tags) {
    const uploadForm = Object.assign({}, this.state.uploadForm);
    uploadForm.tags = tags;
    this.setState({uploadForm})
  }

  handleRemoveClick(e) {
    //1.define the index of the thumbnail that was selected to remove
    //2. if the thumbnail that was chosen is already in the db, keep it in the state so the server can use the id to remove it
    // else, if it's not in the db, remove it from the state
    //3. update the state
    const index = e.currentTarget.className.slice(25);
    const uploadForm = cloneDeep(this.state.uploadForm);
    const selectedFile = uploadForm.files.filesEdits[index];
    console.log('handleRemoveClick() happening. state is', uploadForm.files);
    if (selectedFile.id) {
      selectedFile.remove = true;
    } else if (selectedFile.file) {
      uploadForm.files.filesEdits.splice(index, 1);
    }
    --uploadForm.files.totalFiles;
    this.setState({uploadForm}, () => {console.log('handleRemoveClick() ran and the updated state is:', this.state.uploadForm.files)});
  }

  renderRemoveSymbol(index) {
    //console.log('value being passed to renderDeleteSymbol is', value);
     return(
       <span
        className = {classnames('exit', 'remove-files', `remove-${index}`)}
        onClick = {(e) => this.handleRemoveClick(e)}
       >T</span>
     )
   }

  renderEditField(){
    //debugger;
    //console.log('reached renderEditField()');
    if ((!(this.state.asyncCall.loading)) && (this.state.asyncCall.success === null)) {
      if (this.props.name === 'artistName') {
        return (
          <Fragment>
            <label>{this.props.label}</label>
            <Autocomplete
              className={this.props.name}
              placeholder={this.props.placeholder}
              suggestions={this.props.suggestedArtists}
              name="artistName"
              value={this.state.uploadForm.artistName}
              onChange={this.handleChange}
              noValidate
            />
          </Fragment>
        )
      } else if (this.props.name === 'title') {
        return (
          <LabeledInput
            name="title"
            placeholder={this.props.placeholder}
            type="text"
            value={this.state.uploadForm.title}
            label="Title"
            onChange={this.handleChange}
            noValidate
          />
        )
      } else if (this.props.name === 'category') {
        return(
          <Categories
            categories={this.state.uploadForm.category}
            onChange={this.handleChange}
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
        //debugger;
        const thumbNails = this.state.uploadForm.files.filesEdits.map((e, i) => {
          if(!(e.remove)) {
            return (
              <div
                className='thumbNail'
                key={i}
              >
               <img
                 src={e.src}
                 id={`thumbnail_${i}`}
                 alt={`thumbnail ${i}`}
               >
               </img>
               {this.renderRemoveSymbol(i)}
             </div>
            )
          } else {
            return null
          }
        });
        return(
          <Fragment>
            <RenderDropZone
              name={this.props.name}
              onDrop={this.handleChange}
              files={this.state.uploadForm.files.filesEdits}
            />
            {thumbNails}
          </Fragment>
        )
      }
    } else if (this.state.asyncCall.loading) {
      return toast('loading');
    } else if (this.state.asyncCall.success) {
      return (
        toast.dismiss(),
        toast('success!')
      )
    } else if (this.state.asyncCall.success === false ) {
      return (
        toast.dismiss(),
        toast.error('there was an error updating the content')
      )
    }
  }

  render() {
    //debugger;
    //console.log('rendering edit form');
    return (
      <section
        id="editor-edit"
        className = {
          classnames(
            'editForm',
            {hidden: this.props.className}
          )
        }
        >
        <main>
          <span
            className="exit"
            onClick={this.props.onExit}
          >
            T
         </span>
         <span
           className="submit-edit"
           onClick={this.handleSubmit}
         >
           -
        </span>
        {this.renderEditField()}
        </main>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  thumbNails: state.content.thumbNails,
  authToken: state.auth.authToken,
  suggestedArtists: state.content.suggestedArtists,
  suggestedTags: state.content.suggestedTags
});

export default connect(mapStateToProps)(EditorEditForm);
