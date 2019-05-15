import React from 'react';
//import {reduxForm, Field, reset} from 'redux-form';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import {ToastContainer, toast} from 'react-toastify';

import {filterContent} from '../../actions/content';
import Autocomplete from './autocomplete';
import LabeledInput from '../react-labeled-input';
import './find.css';

const initialState = {
  findForm: {
    browseBy: {
      media: false,
      performance: false,
      text: false
    },
    searchBy: {
      artistName: '',
      title: '',
      tag: ''
    }
  },
  hidden: {
    artistName: true,
    title: true,
    tag: true
  },
  errors: {
    category: '',
    artistName: '',
    title: '',
    tags: ''
  }
}
class EditorFindForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //add feedback to populate toast container
  handleSubmit(event) {
    console.log('doing handleSubmit');
    event.preventDefault();
    const request = new FormData();
    //const errors = {...this.state.errors};
    //const findForm = Object.assign({}, this.state.findForm);
    const root = event.target.id;
    if (root === "searchSubmit") {
      let searchBy;
      for (let property in this.state.hidden) {
        if (this.state.hidden[property] === false) {
          searchBy = property;
          console.log('you want to search by', searchBy);
        }
      }
      console.log('and you submitted this query:', this.state.findForm.searchBy[searchBy]);
      request.append(searchBy, this.state.findForm.searchBy[searchBy]);
    } else {
      debugger;
      //iterate through the category object to turn it into an array;
      let categoryArray = [];
      for (let key in category) {
        if (category[key] === true) {
          categoryArray.push(key)
        }
      }
      request.append('category', categoryArray);
    }
    // TODO: figure out what to do after submit
  }

  //performing validation on field input before it's submitted
  handleChange(event) {
    //debugger;
    console.log('handleChange happening');
    const findForm = Object.assign({}, this.state.findForm);
    if (event.target) { //then the input didn't come from Autocomplete
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") { //user is trying to browse
        const checkValue = event.target.checked ? 'checked' : 'unchecked';
        console.log('you', checkValue, key);
        //if user is submitting a true value for a checkbox
        //then add the new category value to the state
        //if it's false, filter out all categories within the state that equal the key submitted by user
        event.target.checked ? findForm.browseBy[key] = true : findForm.browseBy[key] = false;
        this.setState({findForm});
      } else { //user is trying to search and they typed in this value
        findForm.searchBy[key] = value;
        this.setState({findForm});
      }
    } else {// the input came from autocomplete
      debugger;
      findForm.searchBy[event.key] = event.value;
    }
  }

  dropDownChange(event) {
    //console.log(event.target.value);
    const value = event.target.value;
    //console.log('this.state is:', this.state);
    const initialHidden = {
      artistName: true,
      title: true,
      tag: true
    }
    const hidden = Object.assign({}, initialHidden);
    //console.log('hidden is:', hidden, 'and this.state.hidden is:', initialHidden);
    for (const key in hidden) {
      if (key === value) {
        hidden[key] = false;
        //console.log('now, hidden is:', hidden, 'and this.state.hidden is:', initialHidden);
        //initialState is being mutated when newState gets changed;
        this.setState({hidden});
      }
    }
  }
  render(){
    // let feedback;
    // if (this.state.feedback) {
    //   feedback = (
    //     <div>{this.state.feedback}</div>
    //   )
    // }

    const categories = Object.assign({}, this.state.findForm.browseBy);
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

    // const categories = ['media', 'performance', 'text'];
    // const categoryInputs = categories.map((e, i) => {
    //   return (
    //     <Field
    //       name={e}
    //       component={LabeledInput}
    //       type="checkbox"
    //       label={e}
    //       key={i}
    //       className={"browseBy"}
    //     />
    //   )
    // });
    const optionValues = [
      {
        label: 'Artist Name',
        value: 'artistName'
      },
      {
        label: 'Title',
        value: 'title'
      },
      {
        label: 'Tag',
        value: 'tag'
      },
    ];
    const options = optionValues.map((e, i) => {
      return(
        <option
          value={e.value}
          key={i}
        >{e.label}
        </option>
      )
    });
    return(
      <form
        className="clear-fix"
        noValidate
      >
        <ToastContainer />
        <div id="editor-browse">
          <h3>Browse By...</h3>
          <div className="assign-category">
            <legend>Category</legend>
            {categoryInputs}
          </div>
          <button
            className="float-right"
            type="submit"
            value="browseBy"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
        </div>
        <div id="editor-search">
          <h3>Search By...</h3>
          <div>
            <select
              name="searchBy"
              onChange={this.dropDownChange.bind(this)}
            >
              <option />
              {options}
            </select>
          </div>
          <div>

            <Autocomplete
              className={
                classnames(
                  'artistName',
                  'searchBy',
                  {
                    hidden: this.state.hidden.artistName
                  }
                )
              }
              suggestions={this.props.suggestedArtists}
              name="artistName"
              value={this.state.findForm.searchBy.artistName}
              onChange={this.handleChange}
              noValidate
            />
            <Autocomplete
              className={
                classnames(
                  'title',
                  'searchBy',
                  {
                    hidden: this.state.hidden.title
                  }
                )
              }
              suggestions={this.props.suggestedTitles}
              name="title"
              value={this.state.findForm.searchBy.title}
              onChange={this.handleChange}
              noValidate
            />
            <Autocomplete
              className={
                classnames(
                  'tags',
                  'searchBy',
                  {
                    hidden: this.state.hidden.tag
                  }
                )
              }
              suggestions={this.props.suggestedTags}
              name="tag"
              value={this.state.findForm.searchBy.tags}
              onChange={this.handleChange}
              noValidate
            />
            <button
              className="float-right"
              type="submit"
              id="searchSubmit"
              onClick={this.handleSubmit}
            >Submit
            </button>
          </div>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
    content: state.content.allContent,
    suggestedArtists: state.content.suggestedArtists,
    suggestedTitles: state.content.suggestedTitles,
    suggestedTags: state.content.suggestedTags,
})

export default connect(mapStateToProps)(EditorFindForm);
