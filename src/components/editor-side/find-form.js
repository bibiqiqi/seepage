import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import produce from 'immer';

import {fetchContent} from '../../actions/content/multi-side';
import {filterBySearch, filterByBrowse} from '../../actions/content/editor-side';
import Autocomplete from './autocomplete';
import Categories from './categories';
import './find-form.css';

export class EditorFindForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBrowse = this.handleBrowse.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount(){
    //updates the Redux state with current content in DB and maps suggestedArtists
    //suggestedTitles, and suggestedTags to local state
    this.props.dispatch(fetchContent("editor"));
  }

  handleSubmit(event) {
    //called for submitting search or browse
    //determines whether to call handleBrowse or handleSearch
    //console.log('calling handleSubmit');
    event.preventDefault();
    const root = event.target.value;
    const validationString = (validationProperty) => `${validationProperty} is required`;
    if (root === "searchBy") { //user is trying to search by field
      this.handleSearch(validationString);
    } else { //user is trying to browse by category
      this.handleBrowse(validationString);
    }
  }


  handleBrowse(validationString) {
    const browseBy = produce(this.state.findForm.browseBy.inputs, draft => {
      return draft
    })
    //iterate through the category object to turn it into an array
    let browseByArray = [];
    for (let key in browseBy) {
      if (browseBy[key] === true) {
        browseByArray.push(key)
      }
    }
    //if user chose a category, dispatch filterByBrowse
    if (browseByArray.length) {
      this.props.dispatch(filterByBrowse(browseByArray));
    } else {
      //otherwise, return a validation warning
      const validation = [];
      validation.push(validationString);
      this.setState({validation})
    }
  }

  handleSearch(renderValString, hidden) {
    let searchByObject = {};
    let validation = [];
    const searchBy = produce(this.state.findForm.searchBy, draft => {
      return draft
    })
    //make sure both key and value have been inputted
    if (searchBy.key) {
      searchByObject.key = searchBy.key;
    } else {
      searchByObject.key = "artistName";
    }
    //if user didn't choose a search field
    if(searchBy.value) {
      searchByObject.value = searchBy.value;
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
    const target = event.target;
    this.setState(
      produce(draft => {
        draft.validation = []
        if(target) {
          //then the input didn't come from Autocomplete
          const key = target.name;
          const value = target.value;
          if (target.type === "checkbox") {
            //if user is submitting a true value for a checkbox
            //then add the new category value to the state
            //if it's false, filter out all categories within the state that equal the key submitted by user
            target.checked ? draft.findForm.browseBy.inputs[key] = true : draft.findForm.browseBy.inputs[key] = false;
          } else {
            //user is trying to search and they typed in this value
            draft.findForm.searchBy.value = value;
          }
        }
      })
    )
  }

  handleDropDownChange(event) {
    const value = event.target.value;
    this.setState(
      produce(draft => {
        draft.findForm.searchBy.key = value;
      })
    )
  }

  handleCollapsibleClick(key) {
    this.setState(
      produce(draft => {
        draft.findForm[key].open = !draft.findForm[key].open;
      })
    )
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
            className="float-right clickable"
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
            className="float-right clickable"
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
   if(this.state.validation.length) {
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
         classParentString={'Collapsible editor-browse clickable'}
         open={this.state.findForm.browseBy.open}
         trigger={<h3>Browse By...</h3>}
         handleTriggerClick={() => this.handleCollapsibleClick('browseBy')}
       >
        {this.renderBrowseBy()}
       </Collapsible>

        <Collapsible
          classParentString={'Collapsible editor-search clickable'}
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
})

export default connect(mapStateToProps)(EditorFindForm);
