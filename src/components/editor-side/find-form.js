import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import {toast} from 'react-toastify';

import {fetchContent} from '../../actions/content/multi-side';
import {filterBySearch, filterByBrowse} from '../../actions/content/editor-side';
import Autocomplete from './autocomplete';
import Categories from './categories';
import './find-form.css';

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
  }
}

class EditorFindForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBrowse = this.handleBrowse.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount(){
    console.log('doing componentDidMount');
    //updates the Redux state with current content in DB and map suggestedArtists
    //suggestedTitles, and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  handleSubmit(event) {
    //called for submitting search or browse
    //determines whether to call handleBrowse or handleSearch
    event.preventDefault();
    const state = cloneDeep(this.state);
    const hidden = state.hidden;
    const findForm = state.findForm;
    const root = event.target.id;
    const validationString = (validationProperty) => `${validationProperty} is required`;
    const showAutoSuggestions = false;
    this.setState({showAutoSuggestions}, () => console.log('updated state and showAutoSuggestions is', this.state.showAutoSuggestions));
    if (root === "searchSubmit") { //user is trying to search by field
      this.handleSearch(findForm.searchBy, validationString, hidden);
    } else { //user is trying to browse by category
      this.handleBrowse(findForm.browseBy, validationString);
    }
  }

  handleBrowse(browseByState, renderValString) {
    //iterate through the category object to turn it into an array
    let browseByArray = [];
    for (let key in browseByState) {
      if (browseByState[key] === true) {
        browseByArray.push(key)
      }
    }
    //if user chose a category, dispatch filterByBrowse
    if (browseByArray.length) {
      this.props.dispatch(filterByBrowse(browseByArray));
    } else {
      //otherwise, return a validation warning
      const validation = renderValString('choosing a category');
      toast.warn(validation);
    }
  }

  handleSearch(searchByState, renderValString, hidden) {
    let searchByObject = {};
    let validation;
    //iterating through hidden state to see which parameter user is searching by
    for (let key in hidden) {
      if (hidden[key] === false) {
        searchByObject[key] = searchByState[key];
        console.log('you want to search by', searchByObject);
      }
    }
    //if user didn't choose a search field
    if(!Object.keys(searchByObject).length) {
      validation = renderValString('choosing a search field');
    } else if(!Object.values(searchByObject)[0]) {
      //or enter a search query
      validation = renderValString('entering a search query');
    }
    if(validation) {
      //...return a validation warning
      toast.warn(validation);
    } else {
      ///otherwise, dispatch filterBySearch action
      this.props.dispatch(filterBySearch(searchByObject));
    }
  }

  handleChange(event) {
    //update the state with user's input upon input
    console.log('handleChange happening');
    const findForm = Object.assign({}, this.state.findForm);
    if (event.target) {
      //then the input didn't come from Autocomplete
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") {
        //user is trying to browse
        const checkValue = event.target.checked ? 'checked' : 'unchecked';
        console.log('you', checkValue, key);
        //if user is submitting a true value for a checkbox
        //then add the new category value to the state
        //if it's false, filter out all categories within the state that equal the key submitted by user
        event.target.checked ? findForm.browseBy[key] = true : findForm.browseBy[key] = false;
        this.setState({findForm});
      } else {
        //user is trying to search and they typed in this value
        findForm.searchBy[key] = value;
        this.setState({findForm});
      }
    } else {
      // the input came from autocomplete
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

    return (
      <form
        className="clear-fix"
        noValidate
      >
        <div id="editor-browse">
          <h3>Browse By...</h3>
          <Categories
            categories={this.state.findForm.browseBy}
            onChange={e => this.handleChange(e)}
          />
          <button
            className="float-right"
            value="browseBy"
            type="button"
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
              id="searchSubmit"
              type="button"
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
    loading: state.editorContent.loading,
    error: state.editorContent.error,
    editFilteredContent: state.editorContent.editFilteredContent,
    suggestedArtists: state.editorContent.suggestedArtists,
    suggestedTitles: state.editorContent.suggestedTitles,
    suggestedTags: state.editorContent.suggestedTags,
})

export default connect(mapStateToProps)(EditorFindForm);
