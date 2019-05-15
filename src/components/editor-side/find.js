import React from 'react';
import {Link} from 'react-router-dom';
import {reduxForm, Field} from 'redux-form';

import Logo from '../logo';
import LabeledInput from '../labeled-input';

import './find.css';

class EditorFind extends React.Component {
  onSubmit(values){
    console.log(values);
    {/* AJAX get request with search query
      this.props.dispatch(showResults())
    */}
  }
  dropDownChange(event) {
    console.log(event.target.value);
    {/*change state so that hidden class is removed and added*/}
  }
  render() {
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
      const categoryInputs = categories.map((e) => {
        return (
          <Field
            name={e}
            component={LabeledInput}
            type="checkbox"
            label={e}
          />
        )
      });
      const optionValues = ['Artist Name', 'Title', 'Tag'];
      const options = optionValues.map((e) => {
        return(
          <option value={e}>{e}</option>
        )
      });
    return (
      <section id="editor-find" className="pop-up">
        <Link to="/editor-home"><Logo/></Link>
        <main id="editor-browse-search">
          <span className="back">E</span>
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
                  name="selectSearch"
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
                  label="Artist Name"
                  placeholder="Art Vandelay"
                  className="hidden"
                />
                <Field
                  name="title"
                  component={LabeledInput}
                  type="text"
                  label="Title"
                  placeholder="Arty Art"
                  className="hidden"
                />
                <Field
                  name="tag"
                  component={LabeledInput}
                  type="text"
                  label="Tag"
                  placeholder="posmodernism"
                  className="hidden"
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
          <div id="editor-find-results">
            <h3>Results</h3>
            <div className="browse-results">
              <h4>media</h4>
              <div className="results-preview"></div>
              <h4>text</h4>
              <div className="results-preview"></div>
              <h4>performance</h4>
              <div className="results-preview"></div>
            </div>
            <div className="search-results">
              <div className="results-preview"></div>
            </div>
          </div>
        </main>
      </section>
    )
  }
}

export default reduxForm({
  form: 'editorFind'
})(EditorFind);
