import React, { Fragment } from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {reduxForm, Field} from 'redux-form';
import cloneDeep from 'clone-deep';
import * as classnames from 'classnames';

import {API_BASE_URL} from '../../config';
import Autocomplete from './autocomplete';
import Categories from './categories-controlled-inputs';
import LabeledInput from '../labeled-input-controlled';
import TagsInput from './tags-input';
import RenderDropZone from './dropzone';

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
  validation: {
    artistName: '',
    title: '',
    category: '',
    files: '',
    tags: ''
  }
};

class EditorEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  patchEntry(data) {
    const ajax = {loading: true};
    this.setState({ajax});
    fetch(`${API_BASE_URL}/protected/content`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
      body: data
    })
    .then(data => {
      //debugger;
      const state = cloneDeep(initialState);
      state.ajax = {
        loading: false,
        success: true
      }
      this.setState(state);

      //console.log('state cleared');
    })
    .catch(err => {
      const ajax = {
        loading: false,
        success: false
      };
      this.setState({ajax});
    })
  }

  handleSubmit(event) {
    //console.log('doing handleSubmit');
    event.preventDefault();
    const state = cloneDeep(this.state);
    const upload = state.uploadForm;
    const validation = state.validation;
    //check if each field is in the state and if not, return a warning
    const {artistName, title, tags, files, category} = upload;
    //if all the upload values are true
    if (artistName && title && tags && files && category) {
      //then make an ajax call with the form data
      const data = new FormData();
      //iterate through properties of the upload state object
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
      this.patchEntry(data);
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
    const uploadForm = Object.assign({}, this.state.uploadForm);
    uploadForm.tags = tags;
    this.setState({uploadForm})
  }

  renderEditField(){
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
          placeholder={this.props.placeholder.join(', ')}
          value={this.state.uploadForm.tags}
          label={this.props.label}
          tags={this.state.uploadForm.tags}
          suggestions={this.props.suggestedTags}
          noValidate
          onAddOrDelete={tags => this.handleTagSubmit(tags)}
        />
      )
    }

    // <RenderDropZone
    //   name="files"
    //   onDrop={this.handleChange}
    //   files={this.state.uploadForm.files}
    // />

  }
  render() {
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
           onClick={this.handleSubmitEdit}
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
  authToken: state.auth.authToken,
  suggestedArtists: state.content.suggestedArtists,
  suggestedTags: state.content.suggestedTags
});

export default connect(mapStateToProps)(EditorEditForm);
