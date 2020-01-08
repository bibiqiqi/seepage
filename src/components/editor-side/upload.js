import React, {Fragment} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoThumbnail from 'react-video-thumbnail'; // use npm published version

import TextIcon from '../../text-icon.png';
import {API_BASE_URL} from '../../config';
import Logo from '../multi-side/logo';
import Autocomplete from './autocomplete';
import Categories from './categories';
import LabeledInput from '../multi-side/labeled-input-controlled';
import TagsInput from './tags-input';
import RenderDropZone from './dropzone';
import {normalizeResponseErrors} from '../../actions/utils';
import {fetchContent} from '../../actions/content/multi-side';
import {editContentInState} from '../../actions/content/editor-side';
import './upload.css';
import '../../index.css'

const initialState = {
  uploadForm: {
    artistName: '',
    title: '',
    category: {
      media: false,
      performance: false,
      text: false
      },
    files: [],
    tags: []
  },
  thumbNailUrls: [],
  validation: {
    artistName: '',
    title: '',
    category: '',
    files: '',
    tags: ''
  },
  asyncCall: {
    loading: false,
    success: null
  }
};

//performs POST request
class EditorUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.renderRemoveSymbol = this.renderRemoveSymbol.bind(this);
    this.onCreateObjectUrl = this.onCreateObjectUrl.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.renderThumbNailState = this.renderThumbNailState.bind(this);
  }

  componentDidMount(){
    //console.log('doing componentDidMount');
    //update the Redux state with current content in DB and map suggestedArtists
    //and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  postEntry(data) {
    toast('loading');
    this.setState({loading: true, success: null});
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
      toast.dismiss();
      toast('success!');
      const asyncCall = {loading: false, success: true};
      //you added a doc, so content in state needs to be updated
      this.props.dispatch(editContentInState(post.id, post))
      this.setState(merge(initialState, asyncCall));
    })
    .catch(err => {
      toast.dismiss();
      toast.error('there was an error updating the content');
      const asyncCall = {loading: false, success: false};
      this.setState(merge(initialState, asyncCall));
    })
  }

  handleSubmit(event) {
    //console.log('doing handleSubmit');
    event.preventDefault();
    const state = cloneDeep(this.state);
    const upload = state.uploadForm;
    const validationObject = state.validation;
    const {artistName, title, tags, files, category} = upload;
    //if all the upload values are defined
    if (artistName && title && tags && files && category) {
      //then pluck the values for a formData() object
      const data = new FormData();
      for (let key in upload) {
        if ((key === 'files') || (key === 'tags')) {
          for (let x = 0; x < upload[key].length; x++) {
            data.append(key, upload[key][x]);
          }
        } else if (key === 'category') {
          for (let key in category) {
            if (category[key] === true) {
              data.append('category', key);
            }
          }
        } else {//the value is a string (either artistName or title)
          data.append(key, upload[key]);
        }
      }
      //release existing object URLs, for optimal performance and memory usage
      let thumbNailUrls = state.thumbNailUrls.map(e => {
        return window.URL.revokeObjectURL(e);
      });
      thumbNailUrls = [];
      this.setState({thumbNailUrls})
      this.postEntry(data);
    } else {
      //if any of the upload values are not defined, update the state for validation object and return feedback to user
      const validation = this.handleValidation(upload, validationObject)
       this.setState({validation});
    }
  }

  handleValidation(uploadObject, validationObject) {
    //iterate through the upload object to find which
    //fields don't have values and return a validation object
    const validationString = (validationProperty) => `${validationProperty} is required`;
     for (let property in uploadObject) {
       //if the value for this key is undefined
        if (property === 'artistName') {
          validationObject[property] = validationString('artist name');
        } else if (typeof uploadObject[property] === 'string') { //title
          if(!uploadObject[property]) {
            validationObject[property] = validationString(property);
          }
        } else if (Array.isArray(uploadObject[property])) {
          console.log(`${property} is an array`);
          if (!uploadObject[property].length) { //tags and files
            validationObject[property] = validationString(property);
          }
        } else if (typeof uploadObject[property] === 'object') { //category
          console.log(`${property} is an object`);
          if (Object.values(uploadObject[property]).every(e => e === false)) {
            validationObject[property] = validationString(property);
          }
        }
     }
    return validationObject;
  }

  onCreateObjectUrl(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
  }

  handleChange(event) {
    //immediately updates the state with change in update
    const {uploadForm, thumbNailUrls} = cloneDeep(this.state);
    const validation = initialState.validation;
    this.setState({validation});
    //if event.target doesn't exist, then the change came from file input
    if (!(event.target)) {
      event.forEach(file => {
        const thumbNailObject = {};
        thumbNailObject.type = file.type;
        uploadForm.files.push(file);
        if((file.type.includes('image')) || (file.type.includes('video'))) {
          thumbNailObject.url = this.onCreateObjectUrl(file);
        } else if (file.type.includes('pdf')) {
          thumbNailObject.url = TextIcon
        }
        thumbNailUrls.push(thumbNailObject);
      });
      this.setState({uploadForm, thumbNailUrls}, () => {console.log('updated the state with files and thumbNailUrls', this.state)});
    } else { //otherwise the change came from either a text input or a checkbox input
      const key = event.target.name;
      if (event.target.type === "checkbox") {
        //if input type is checkbox, then update value to either true or false
        event.target.checked ? uploadForm.category[key] = true : uploadForm.category[key] = false;
        this.setState({uploadForm});
      } else {
        const value = event.target.value;
        //otherwise input is a text value, so update the state with current string
        uploadForm[key] = value.trim();
        this.setState({uploadForm});
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
    //selected to remove a file i the current edit form
    const index = e.currentTarget.className.slice(25);
    const state = cloneDeep(this.state);
    const {uploadForm, thumbNailUrls} = state;
    uploadForm.files.splice(index, 1);
    thumbNailUrls.splice(index, 1);
    this.setState({uploadForm, thumbNailUrls}, () => {console.log('updated the state with files and thumbNailUrls', this.state)});
  }

  renderRemoveSymbol(index) {
    //renders the symbol for removing files that are in the current edit form
     return(
       <span
         className = {classnames('exit', 'float-right', `remove-${index}`, 'clickable')}
         onClick = {(e) => this.handleRemoveClick(e)}
       >
        <i className="material-icons">close</i>
       </span>
     )
   }

  renderThumbNailState() {
    if(this.state.thumbNailUrls){
      const thumbNails = this.state.thumbNailUrls.map((e, i) => {
        let thumbNail;
        if(e.type.includes('video')) {
          thumbNail =
            <VideoThumbnail
              videoUrl={e.url}
              width={100}
            />
        } else {
          thumbNail =
            <img
              key={i}
              src={e.url}
              className='thumbnail-fit'
              id={`thumbnail_${i}`}
              alt={`thumbnail ${i} for your current upload`}
            >
            </img>
        }
        return (
          <Fragment>
            {this.renderRemoveSymbol(i)}
            <div
              className='thumbnail'
            >
            {thumbNail}
           </div>
          </Fragment>
        )
      });
      return thumbNails;
    } else {
      return null
    }
  }

  render() {
    const validation = Object.assign({}, this.state.validation);
    Object.values(validation).forEach(e => {
      if (e) {
        toast.warn(e);
      }
    })

    return (
      <section id="editor-upload" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <NavLink
            to='editor-home'
            className="back"
          >E
          </NavLink>
          <ToastContainer
            autoClose={5000}
            hideProgressBar
          />
          <form
            className="clear-fix"
            noValidate
          >
            <label>Artist Name</label>
            <Autocomplete
              className="artistName"
              suggestions={this.props.suggestedArtists}
              name="artistName"
              value={this.state.uploadForm.artistName}
              onChange={this.handleChange}
              noValidate
            />
            <LabeledInput
              name="title"
              type="text"
              value={this.state.uploadForm.title}
              label="Title"
              onChange={this.handleChange}
              noValidate
            />
             <Fragment>
               <RenderDropZone
                name="files"
                onDrop={this.handleChange}
                files={this.state.uploadForm.files}
              />
              {this.renderThumbNailState()}
            </Fragment>
            <Categories
              categories={this.state.uploadForm.category}
              onChange={this.handleChange}
            />
            <TagsInput
              name="tags"
              type="text"
              value={this.state.uploadForm.tags}
              label="Tags"
              tags={this.state.uploadForm.tags}
              suggestions={this.props.suggestedTags}
              noValidate
              onAddOrDelete={tags => this.handleTagSubmit(tags)}
            />
            <button
              className="float-right"
              type="button"
              id="uploadContent"
              onClick={this.handleSubmit}
            >
            Submit</button>
          </form>
        </main>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.authToken,
  suggestedArtists: state.editorContent.suggestedArtists,
  suggestedTags: state.editorContent.suggestedTags
});

export default connect(mapStateToProps)(EditorUpload);
