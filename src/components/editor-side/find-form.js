import React from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';

import {filterContent} from '../../actions/content';

import LabeledInput from '../labeled-input';

import './find.css';

const initialState = {
  artistName: true,
  title: true,
  tag: true
};

class EditorFindForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  onSubmit(values){
    this.props.dispatch(filterContent(values));
  }
  dropDownChange(event) {
    //console.log(event.target.value);
    const value = event.target.value;
    let newState = Object.assign({}, initialState);
    for (const key in newState) {
      if (key === value) {
        newState[key] = false;
        //console.log('new state is:', newState);
        this.setState(newState);
      }
    }
  }
  render(){
    let successMessage;
    if (this.props.submitSucceeded) {
      successMessage = (
        <div className="message message-success">
          Message submitted successfully
        </div>
      );
    }
    let errorMessage;
    if (this.props.error) {
      errorMessage = (
        <div className="message message-error">{this.props.error}</div>
      );
    }
    const categories = ['media', 'performance', 'text'];
    const categoryInputs = categories.map((e, i) => {
      return (
        <Field
          name={e}
          component={LabeledInput}
          type="checkbox"
          label={e}
          key={i}
        />
      )
    });
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
        onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
      >
        {successMessage}
        {errorMessage}
        <div id="editor-browse">
          <h3>Browse By...</h3>
          <div className="assign-category">
            <legend>Category</legend>
            {categoryInputs}
          </div>
          <button
            className="float-right"
            type="submit"
            value="Submit">
            Submit
          </button>
        </div>
        <div id="editor-search">
          <h3>Search By...</h3>
          <div>
            <Field
              name="searchBy"
              component="select"
              onChange={this.dropDownChange.bind(this)}
            >
              <option />
              {options}
            </Field>
          </div>
          <div>
            <Field
              name="artistName"
              component={LabeledInput}
              type="text"
              placeholder="Art Vandelay"
              className={this.state.artistName? 'hidden': null}
            />
            <Field
              name="title"
              component={LabeledInput}
              type="text"
              placeholder="Arty Art"
              className={this.state.title? 'hidden': null}
            />
            <Field
              name="tag"
              component={LabeledInput}
              type="text"
              placeholder="posmodernism"
              className={this.state.tag? 'hidden': null}
            />
            <button
              className="float-right"
              type="submit"
              id="searchSubmit"
            >Submit
            </button>
          </div>
        </div>
      </form>
    )
  }
}

export default EditorFindForm = reduxForm({
  form: 'editorFind'
})(EditorFindForm);
