import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import produce from 'immer';

import Thumbnails from '../multi-side/thumbnails';
import FileAndUrlInput from './file-url-input'
import {Button} from '../multi-side/clickables';
import {API_BASE_URL} from '../../config';
import Logo from '../multi-side/logo';
import Autocomplete from './autocomplete';
import Categories from './categories';
import TagsInput from './tags-input';
import {renderValidationWarnings, renderAsyncState} from '../multi-side/user-feedback.js'
import {normalizeResponseErrors} from '../../actions/utils';
import {fetchContent} from '../../actions/content/multi-side';
import {editContentInState} from '../../actions/content/editor-side';
import './upload.css';

const initialState = {
  uploadForm: {
    artistName: '',
    title: '',
    description: '',
    category: {
      media: false,
      performance: false,
      text: false
      },
    files: [],
    tags: []
  },
  thumbnailUrls: [],
  validation: {
    artistName: '',
    title: '',
    category: '',
    tags: '',
    files: '',
    url: ''
  },
  asyncCall: {
    loading: false,
    success: null
  }
};

//performs POST request
export class EditorUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = produce(initialState, draftState => {
      return draftState
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleFileOrUrlRemove = this.handleFileOrUrlRemove.bind(this);
    this.handleFileOrUrlAdd = this.handleFileOrUrlAdd.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleRemoveThumbnail = this.handleRemoveThumbnail.bind(this);
  }

  componentDidMount(){
    //update the Redux state with current content in DB and map suggestedArtists
    //and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  postEntry(data) {
    const asyncCall = {loading: true, success: null};
    this.setState({asyncCall});
    fetch(`${API_BASE_URL}/protected/content`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`
      },
      body: data
    })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then(post => {
      //you added a doc, so content in redux state needs to be updated
      this.props.dispatch(editContentInState(post.id, post));
      this.setState(produce(initialState, draft => {
        draft.asyncCall = {loading: false, success: true};
      }));
    })
    .catch(err => {
      this.setState(produce(initialState, draft => {
        draft.asyncCall = {loading: false, success: false};
      }));
    })
  }

  handleSubmit(event) {
     event.preventDefault();
     const upload = produce(this.state.uploadForm, draftUpload => {
       return draftUpload;
     });
     let {artistName, title, tags, files, category} = upload;
     //if all the upload values are defined
     if (
         artistName &&
         title &&
         (category.media || category.performance || category.text) &&
         tags.length &&
         files.length
       ) {
       //then pluck the values for a formData() object
       const data = new FormData();
       for (let key in upload) {
         if (key === 'files') {
           upload[key].forEach(e => data.append(key, e.file));
         } else if (key === 'tags') {
           for (let x = 0; x < upload[key].length; x++) {
             data.append(key, upload[key][x]);
           }
         } else if (key === 'category') {
           for (let key in category) {
             if (category[key] === true) {
               data.append('category', key);
             }
           }
         } else {//the value is a string (either artistName or title, or description)
           data.append(key, upload[key].trim());
         }
       }
       //release existing object URLs, for optimal performance and memory usage
       this.setState(
         produce(draft => {
           draft.thumbnailUrls.forEach(e => {
             return window.URL.revokeObjectURL(e);
           });
         }))
       this.postEntry(data);
     } else {
       //if any of the upload values are not defined, update the state for validation object and return feedback to user
       const validation = this.handleValidation();
       this.setState({validation});
     }
   }

   handleValidation() {
   const validation = Object.assign({}, this.state.validation);
   const uploadForm = Object.assign({}, this.state.uploadForm)
   //iterate through the upload object to find which
   //fields don't have values and return a validation object
   const validationString = (validationProperty) => `${validationProperty} is required`;
    for (let property in uploadForm) {
      //if the value for this key is undefined and the key isn't 'description'
      if((!uploadForm[property]) && (property !== 'description')){
        if (property === 'artistName') { //artistName
          validation[property] = validationString('artist name');
        } else { //title
          validation[property] = validationString(property);
        }
      } else if (((Array.isArray(uploadForm[property])) && (!uploadForm[property].length)) || //tags
        ((typeof uploadForm[property] === 'object') && (Object.values(uploadForm[property]).every(e => e === false)))) { //category
         validation[property] = validationString(property);
      }
   }
   return validation;
 }

  handleCheckBoxChange(event) {
    const checked = event.target.checked;
    const key = event.target.name;
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      checked ? draft.uploadForm.category[key] = true : draft.uploadForm.category[key] = false;
    }));
  }

  handleTextInput(event) {
    const key = event.target.name
    const value = event.target.value;;
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      draft.uploadForm[key] = value;
    }))
  }

//the react-tags component handles input change and tag suggestions internally, so
//handleTagSubmit is only called when a full tag string is submitted to this state
  handleTagSubmit(tags) {
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      draft.uploadForm.tags = tags;
    }))
  }

  handleFileOrUrlRemove(index){
    this.setState(produce(draft => {
      draft.uploadForm.splice(index, 1);
    }))
  }

  handleFileOrUrlAdd(fileOrUrl){
    this.setState(produce(draft => {
      draft.validation = initialState.validation;
      draft.thumbnailUrls.push(fileOrUrl);
      draft.uploadForm.files.push(fileOrUrl);
    }))
  }

  handleRemoveThumbnail(index) {
    this.setState(produce(draft => {
      if(draft.thumbnailUrls[index].fileType.includes('image')) {
        window.URL.revokeObjectURL(draft.thumbnailUrls[index].src)
      }
      draft.thumbnailUrls.splice(index, 1);
      draft.uploadForm.files.splice(index, 1)
    }));
  }

  render() {
    return (
      <section id="editor-upload" className="screen">
        <Link to="/editor-home"><Logo/></Link>
        <form id="upload-form">
          {renderValidationWarnings(this.state.validation)}
          {renderAsyncState(this.state.asyncCall, 'upload')}
          <div className="upload-flex">
            <Autocomplete
              id="upload-artistname"
              placeholder="Artist Name"
              className="artistName"
              suggestions={this.props.suggestedArtists}
              name="artistName"
              value={this.state.uploadForm.artistName}
              onChange={this.handleTextInput}
              noValidate
            />
            <input
              id="upload-title"
              name="title"
              placeholder="Title"
              type="text"
              value={this.state.uploadForm.title}
              onChange={this.handleTextInput}
              noValidate
            />
            <label
              for="upload-title"
            >
              title
            </label>
            <input
              id="upload-description"
              name="description"
              placeholder="Description"
              type="text"
              value={this.state.uploadForm.description}
              onChange={this.handleTextInput}
              noValidate
            />
            <label
              for='upload-description'
            >
              description
            </label>
            <FileAndUrlInput
              onFileOrUrlAdd={fileObject => this.handleFileOrUrlAdd(fileObject)}
              onFileValidation={files => {
                this.setState(produce(draft => {
                  draft.validation.files = files;
                }))
              }}
              onUrlValidation={url => {
                this.setState(produce(draft => {
                  draft.validation.url = url;
                }))
              }}
            />
            <Thumbnails
              thumbnailUrls={this.state.thumbnailUrls}
              handleRemoveClick={this.handleRemoveThumbnail}
              gallery={false}
              autoplay={0}
            />
            <Categories
              categories={this.state.uploadForm.category}
              onChange={this.handleCheckBoxChange}
            />
            <TagsInput
              name="tags"
              type="text"
              value={this.state.uploadForm.tags}
              label="Tags"
              tags={this.state.uploadForm.tags}
              noValidate
              onAddOrDelete={tags => this.handleTagSubmit(tags)}
            />
          </div>
          <Button
            className='clickable publish'
            handleClick={this.handleSubmit}
            glyph='publish'
            text='publish'
          />
        </form>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.authToken,
  suggestedArtists: state.editorContent.suggestedArtists
});

export default connect(mapStateToProps)(EditorUpload);
