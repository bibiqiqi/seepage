import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cloneDeep from 'clone-deep';

import {API_BASE_URL} from '../../config';
import Logo from '../logo';
import Autocomplete from './autocomplete';
import Categories from './categories-controlled-inputs';
import LabeledInput from '../labeled-input-controlled';
import TagsInput from './tags-input';
import RenderDropZone from './dropzone';
import {fetchContent} from '../../actions/content';
import {normalizeResponseErrors} from '../../actions/utils';
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
  ajax: {
    loading: false,
    success: null
  },
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
  }

  componentDidMount(){
    //console.log('doing componentDidMount');
    //update the Redux state with current content in DB and map suggestedArtists
    //and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  postEntry(data) {
    debugger;
    const ajax = {loading: true};
    this.setState({ajax});
    fetch(`${API_BASE_URL}/protected/content`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
      body: data
    })
    .then(data => {
      //debugger;
      toast.dismiss();
      const state = cloneDeep(initialState);
      state.ajax = {
        loading: false,
        success: true
      }
      this.setState(state);

      //console.log('state cleared');
    })
    .catch(err => {
      toast.dismiss();
      const ajax = {
        loading: false,
        success: false
      };
      this.setState({ajax});
    })
  }

  handleSubmit(event) {
    //debugger;
    //console.log('doing handleSubmit');
    event.preventDefault();
    const state = cloneDeep(this.state);
    const upload = state.uploadForm;
    const validation = state.validation;
    //debugger;
    //check if each field is in the state and if not, return a warning
    const {artistName, title, tags, files, category} = upload;
    //if all the upload values are true
    if (artistName && title && tags && files && category) {
      //then make an ajax call with the form data
      const data = new FormData();
      //iterate through through properties of the upload state object
      for (let key in upload) {
        if ((key === 'files') || (key === 'tags')) {
          //iterate through array
          for (var x = 0; x < upload[key].length; x++) {
            data.append(key, upload[key][x]);
            //console.log('appended a key!');
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
        } else { //the value is a string (either artistName or title)
          //debugger;
          data.append(key, upload[key]);
          //console.log('appended another value!');
        }
      }
      //console.log('data being sent to server is', data);
      this.postEntry(data);
    } else { //iterate through the upload object to find which
      //fields don't have values, update the state and send error messages back to the user
         for (let key in upload) {
           //if the value for this key equals false
          if (!(upload.hasOwnProperty[key])) {
            //then update the state validation Object
            validation[key] = `${key} is required`;
          }
        }
        this.setState({validation});

    }
  }

  //performing validation on field input before it's submitted
  handleChange(event) {
    //debugger;
    //console.log('handleChange happening');
    const uploadForm = cloneDeep(this.state.uploadForm);
    const validation = initialState.validation;
    this.setState({validation});
    //if event.target doesn't exist, then the change came from file input
    if (!(event.target)) {
      uploadForm.files = event;
      this.setState({uploadForm});
    } else { //otherwise the change came from either a text input or a checkbox input
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") {
        const checkValue = event.target.checked ? 'checked' : 'unchecked';
        //console.log('you', checkValue, key);
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
    //debugger;
    const uploadForm = Object.assign({}, this.state.uploadForm);
    uploadForm.tags = tags;
    this.setState({uploadForm})
  }

  render() {
    const validation = Object.assign({}, this.state.validation);
    Object.values(validation).forEach(e => {
      if (e) {
        toast.warn(e);
      }
    })

    const ajax = Object.assign({}, this.state.ajax);
    if (ajax.loading === true) {
        toast('loading');
    }
    if (ajax.success === true) {
      toast.success('content was successfully uploaded');
    } else if (ajax.success == false) {
      toast.error('an error has occured whle trying to upload your content');
    }

    return (
      <section id="editor-upload" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <span className="back">E</span>
          <ToastContainer autoClose={5000}/>
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
