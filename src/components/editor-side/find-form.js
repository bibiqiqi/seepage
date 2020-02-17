import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import cloneDeep from 'clone-deep';
import Collapsible from 'react-collapsible';

import {fetchContent} from '../../actions/content/multi-side';
import {filterBySearch, filterByBrowse} from '../../actions/content/editor-side';
import Autocomplete from './autocomplete';
import Categories from './categories';
import './find-form.css';


const initialState = {
  findForm: {
    browseBy: {
      open: false,
      inputs: {
        media: false,
        performance: false,
        text: false
      }
    },
    searchBy: {
      open: false,
      key: '',
      value: ''
    }
  },
  validation: [],
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
    //console.log('doing componentDidMount');
    //updates the Redux state with current content in DB and maps suggestedArtists
    //suggestedTitles, and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  handleSubmit(event) {
    //called for submitting search or browse
    //determines whether to call handleBrowse or handleSearch
    //console.log('calling handleSubmit');
    event.preventDefault();
    const state = cloneDeep(this.state);
    const findForm = state.findForm;
    const root = event.target.value;
    const validationString = (validationProperty) => `${validationProperty} is required`;
    const showAutoSuggestions = false;
    this.setState({showAutoSuggestions});
    if (root === "searchBy") { //user is trying to search by field
      this.handleSearch(findForm.searchBy, validationString);
    } else { //user is trying to browse by category
      this.handleBrowse(findForm.browseBy.inputs, validationString);
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
      this.setState({validation: validation})
    }
  }

  handleSearch(searchByState, renderValString, hidden) {
    //console.log('running handleSearch');
    let searchByObject = {};
    let validation = [];
    //make sure both key and value have been inputted
    if (searchByState.key) {
      searchByObject.key = searchByState.key;
    } else {
      searchByObject.key = "artistName";
    }
    //if user didn't choose a search field
    if(searchByState.value) {
      searchByObject.value = searchByState.value;
    } else {
      validation.push(renderValString('entering a search query'));
    }
    if(validation.length) {
      //...return a validation warning
      this.setState({validation: validation});
    } else {
      ///otherwise, dispatch filterBySearch action
      this.props.dispatch(filterBySearch(searchByObject));
    }
  }

  handleChange(event) {
    //update the state with user's input upon input
    //console.log('handleChange happening');
    this.setState({validation: []});
    const findForm = Object.assign({}, this.state.findForm);
    if (event.target) {
      //then the input didn't come from Autocomplete
      const key = event.target.name;
      const value = event.target.value;
      if (event.target.type === "checkbox") {
        //if user is submitting a true value for a checkbox
        //then add the new category value to the state
        //if it's false, filter out all categories within the state that equal the key submitted by user
        event.target.checked ? findForm.browseBy.inputs[key] = true : findForm.browseBy.inputs[key] = false;
        this.setState({findForm});
      } else {
        //user is trying to search and they typed in this value
        findForm.searchBy.value = value;
        this.setState({findForm});
      }
    }
  }

  handleDropDownChange(event) {
    const value = event.target.value;
    const findForm = Object.assign({}, this.state.findForm);
    findForm.searchBy.key = value;
    this.setState({findForm})
  }

  handleCollapsibleClick(key) {
    const findForm = cloneDeep(this.state.findForm);
    findForm[key].open = !findForm[key].open;
    this.setState({findForm})
  }

  renderSelectOptions(){
    const optionValues = [
      {
        label: 'select',
        value: ''
      },
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

    return options
  }

  renderSearchBy() {
    if(this.state.findForm.searchBy.open) {
      const { searchBy } = this.state.findForm;
      return (
        <Fragment>
          <div className='searchBy'>
            <select
              name="searchBy"
              onChange={this.handleDropDownChange.bind(this)}
            >
              {this.renderSelectOptions()}
            </select>

            <Autocomplete
              className='searchBy-input'
              name={searchBy.key}
              value={searchBy.value}
              onChange={this.handleChange}
              noValidate
            />
          </div>
          <button
            className="float-right"
            type="button"
            value="searchBy"
            onClick={this.handleSubmit}
          >Submit
          </button>
        </Fragment>
      )
    } else {
      return null
    }
  }

  renderBrowseBy(){
    if(this.state.findForm.browseBy.open) {
      return (
        <Fragment>
          <Categories
            categories={this.state.findForm.browseBy.inputs}
            onChange={this.handleChange}
          />
          <button
            className="float-right"
            value="browseBy"
            type="button"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
        </Fragment>
      )
    } else {
      return null
    }
  }

  render(){

   let validationWarning;
   if (this.state.validation.length) {
     validationWarning = this.state.validation.map(e => {
       return(
         <div className="message warning-message">
           {e}
         </div>
       )
     })
   }
    return (
      <form
        className="editor-find-form"
        noValidate
      >
      {validationWarning}
       <Collapsible
         classParentString={'Collapsible editor-browse'}
         open={this.state.findForm.browseBy.open}
         trigger={<h3>Browse By...</h3>}
         handleTriggerClick={() => this.handleCollapsibleClick('browseBy')}
       >
        {this.renderBrowseBy()}
       </Collapsible>

        <Collapsible
          classParentString={'Collapsible editor-search'}
          open={this.state.findForm.searchBy.open}
          trigger={<h3>Search By...</h3>}
          handleTriggerClick={() => this.handleCollapsibleClick('searchBy')}
        >
          {this.renderSearchBy()}
         </Collapsible>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
    loading: state.editorContent.loading,
    error: state.editorContent.error,
    editFilteredContent: state.editorContent.editFilteredContent,
})

export default connect(mapStateToProps)(EditorFindForm);
