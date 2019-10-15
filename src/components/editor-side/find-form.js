import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';

import {filterContent, fetchContent} from '../../actions/content';
import Autocomplete from './autocomplete';
import Categories from './categories-controlled-inputs';
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
    },
    filterObject: null
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

  componentDidMount(){
    console.log('doing componentDidMount');
    //updates the Redux state with current content in DB and map suggestedArtists
    //suggestedTitles, and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  // TODO: add validation checking before user's form is submitting
  handleSubmit(event) {
    const state = cloneDeep(this.state);
    const findForm = state.findForm;
    console.log('doing handleSubmit');
    event.preventDefault();
    //debugger;
    //const errors = {...this.state.errors};
    let filterObject = {};
    const root = event.target.id;
    if (root === "searchSubmit") {
      let searchBy = {};
      //iterating through hidden state to see which parameter user is searching by
      for (let key in state.hidden) {
        if (state.hidden[key] === false) {
          searchBy[key] = findForm.searchBy[key];
          console.log('you want to search by', searchBy);
        }
      }
      filterObject.searchBy = searchBy;
    } else {
      //debugger;
      const category = Object.assign({}, findForm.browseBy);
      //iterate through the category object to turn it into an array;
      let categoryArray = [];
      for (let key in category) {
        if (category[key] === true) {
          categoryArray.push(key)
        }
      }
      filterObject.browseBy = categoryArray;
    }
    findForm.filterObject = filterObject;
    this.setState({findForm});
    //debugger;
    this.props.dispatch(filterContent(filterObject));
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
      //debugger;
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
    return(
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
    suggestedArtists: state.content.suggestedArtists,
    suggestedTitles: state.content.suggestedTitles,
    suggestedTags: state.content.suggestedTags,
})

export default connect(mapStateToProps)(EditorFindForm);
