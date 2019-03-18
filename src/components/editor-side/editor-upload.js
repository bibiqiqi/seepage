import React from 'react';
import {Link} from 'react-router-dom';
import {reduxForm, Field} from 'redux-form';

import Logo from '../logo';
import LabeledInput from '../labeled-input';
import TagsInput from './editor-tags-input';
//import renderDropZone from './editor-dropzone';
import {required, nonEmpty} from '../../validators';

import './editor-upload.css';

class EditorUpload extends React.Component {
  onSubmit(values){
    console.log(values);
    {/* AJAX call to POST upload info;
    */}
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

    return (
      <section id="editor-upload" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <span className="back">E</span>
          <form
            className="clear-fix"
            enctype="multipart/form-data"
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
            {successMessage}
            {errorMessage}
            <Field
              name="artistName"
              component={LabeledInput}
              type="text"
              label="Artist Name"
              placeholder="Art Vandelay"
              validate={[required, nonEmpty]}
            />
            <Field
              name="title"
              component={LabeledInput}
              type="text"
              label="Title"
              placeholder="Arty Art"
              validate={[required, nonEmpty]}
            />
            <Field
              name="content"
              component={LabeledInput}
              multiple
              type="file"
            />
            <div className="assign-category">
              <legend>Category</legend>
              {categoryInputs}
            </div>
            <Field
              name="tags"
              component={TagsInput}
              type="text"
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

export default reduxForm({
  form: 'editorUpload'
})(EditorUpload);
