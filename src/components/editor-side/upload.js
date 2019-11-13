import React, {Fragment} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cloneDeep from 'clone-deep';

import {API_BASE_URL} from '../../config';
import Logo from '../logo';
import Autocomplete from './autocomplete';
import Categories from './categories';
import LabeledInput from '../labeled-input-controlled';
import TagsInput from './tags-input';
import RenderDropZone from './dropzone';
import {fetchContent} from '../../actions/content';
import './upload.css';


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
  }
};

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
  }

  componentDidMount(){
    //console.log('doing componentDidMount');
    //update the Redux state with current content in DB and map suggestedArtists
    //and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  postEntry(data) {
    toast('loading');
    fetch(`${API_BASE_URL}/protected/content`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`
      },
      body: data
    })
    .then(res => {
      console.log('did the dang thing', res);
      this.setState((prevState) => {
        return initialState;
      });
      toast.dismiss();
      toast('you successfully made a post');
    })
    .catch(err => {
      toast.dismiss();
      toast.error('an error has occured whle trying to upload your content');

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
          for (var x = 0; x < upload[key].length; x++) {
            data.append(key, upload[key][x]);
          }
        } else if (key === 'category') {
          //iterate through the category object to turn it into an array;
          let categoryArray = [];
          for (let key in category) {
            if (category[key] === true) {
              categoryArray.push(key)
            }
          }
          data.append('category', categoryArray);
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
    const uploadForm = cloneDeep(this.state.uploadForm);
    const thumbNailUrls = Object.assign([], this.state.thumbNailUrls);
    const validation = initialState.validation;
    this.setState({validation});
    //if event.target doesn't exist, then the change came from file input
    if (!(event.target)) {
      event.forEach(e => {
        uploadForm.files.push(e);
        thumbNailUrls.push(this.onCreateObjectUrl(e));
      })
      this.setState({uploadForm, thumbNailUrls}, () => {console.log('updated the state with files and thumbNailUrls', this.state)});
    } else { //otherwise the change came from either a text input or a checkbox input
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") {
        //if input type is checkbox, then update value to either true or false
        event.target.checked ? uploadForm.category[key] = true : uploadForm.category[key] = false;
        this.setState({uploadForm});
      } else {
        //otherwise input is a text value, so update the state with current string
        uploadForm[key] = value;
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
         className = {classnames('exit', 'remove-files', `remove-${index}`)}
         onClick = {(e) => this.handleRemoveClick(e)}
       >T</span>
     )
   }

  render() {
    const validation = Object.assign({}, this.state.validation);
    Object.values(validation).forEach(e => {
      if (e) {
        toast.warn(e);
      }
    })

    const thumbNails = this.state.thumbNailUrls.map((e, i) => {
      return (
        <div
          className='thumbNail'
          key={i}
        >
         <img
           src={e}
           id={`thumbnail_${i}`}
           alt={`file ${i}`}
         >
         </img>
         {this.renderRemoveSymbol(i)}
       </div>
      )
    });
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
            onSubmit={this.handleSubmit}
            noValidate
          >
            <label>Artist Name</label>
            <Autocomplete
              className="artistName"
              suggestions={this.props.suggestedArtists}
              name="artistName"
              value={this.state.uploadForm.artistName}
              onChange={e => this.handleChange(e)}
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
              {thumbNails}
            </Fragment>
            <Categories
              categories={this.state.uploadForm.category}
              onChange={e => this.handleChange(e)}
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
  suggestedArtists: state.content.suggestedArtists,
  suggestedTags: state.content.suggestedTags
});

export default connect(mapStateToProps)(EditorUpload);
