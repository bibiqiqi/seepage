import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';
//import {u} from 'updeep';
import cloneDeep from 'clone-deep';

import {fetchContent} from '../../actions/content';
import Autocomplete from './autocomplete';
import Logo from '../logo';
import LabeledInput from '../react-labeled-input';
import TagsInput from './tags-input';
import RenderDropZone from './dropzone';
import './upload.css';
import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';

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
  errors: {
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
  }

  componentDidMount(){
    console.log('doing componentDidMount');
    //update the Redux state with current content in DB and map suggestedArtists
    //and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  postEntry(data) {
    fetch(`${API_BASE_URL}/protected/content`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
      body: data
    })
    .then(data => {
      //debugger;
      const upload = cloneDeep(initialState.uploadForm);
      this.setState({upload});
      toast.success("content was successfully uploaded");

      console.log('state cleared');
    })
    .catch(err => toast.error(err))
  }

  handleSubmit(event) {
    console.log('doing handleSubmit');
    event.preventDefault();
    //TODO: fix this.state.errors
    const errors = {...this.state.errors};
    const upload = Object.assign({}, this.state.uploadForm);
    //check if each field is in the state and if not, return a warning
    const {artistName, title, tags, files, category} = upload;
    //if all the upload values are true
    if (artistName && title && tags && files && category) {
      //then make an ajax call with the form data
      const data = new FormData();
      //iterate through through properties of the upload state object
      for (let property in upload) {
        if ((property === 'files') || (property === 'tags')) {
          //iterate through array
          for (var x = 0; x < upload[property].length; x++) {
            data.append(property, upload[property][x]);
            console.log('appended a property!');
          }
        } else if (property === 'category') {
          //iterate through the category object to turn it into an array;
          let categoryArray = [];
          for (let key in category) {
            if (category[key] === true) {
              categoryArray.push(key)
            }
          }
          data.append('category', categoryArray);
        } else {
          data.append(property, upload[property]);
          console.log('appended another value!');
        }
      }
      console.log('data being sent to server is', data)
      this.postEntry(data);
    } else { //iterate through the upload object to find which
      //fields don't have values, update the state and send error messages back to the user
         for (let property in upload) {
           //if the value for this property equals false
          if (!(upload[property])) {
            //then update the state errors Object
            errors[property] = `${property} is required`;
            toast.error(errors[property]);
          }
        }
    }
  }

  //performing validation on field input before it's submitted
  handleChange(event) {
    //debugger;
    console.log('handleChange happening');
    const uploadForm = Object.assign({}, this.state.uploadForm);
    //if event.target doesn't exist, then the change came from file input
    if (!(event.target)) {
      console.log('file you selected is', event)
      uploadForm.files = event;
      this.setState({uploadForm});
    } else { //otherwise the change came from either a text input or a checkbox input
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") {
        const checkValue = event.target.checked ? 'checked' : 'unchecked';
        console.log('you', checkValue, key);
        //if input is checkbox, then update value to either true or false
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
    const upload = {...this.state.uploadForm};
    upload.tags = tags;
    this.setState({upload})
  }

  render() {
    const categories = Object.assign({}, this.state.uploadForm.category);
    let i = 1;
    const categoryInputs = [];
    for (let key in categories) {
      if (categories.hasOwnProperty(key)) {
        categoryInputs.push(
          <LabeledInput
            name={key}
            type="checkbox"
            label={key}
            key={i}
            onChange={this.handleChange}
            checked={categories[key]}
          />
        )
      }
      i++;
    }

    return (
      <section id="editor-upload" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <span className="back">E</span>
          <form
            className="clear-fix"
            onSubmit={this.handleSubmit}
            noValidate
          >
            <ToastContainer />
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
            <RenderDropZone
              name="files"
              onDrop={this.handleChange}
              files={this.state.uploadForm.files}
            />
            <div className="assign-category">
              <legend>Category</legend>
              {categoryInputs}
            </div>
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
              type="submit"
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
