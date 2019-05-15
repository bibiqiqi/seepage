import React from 'react';
import {Link} from 'react-router-dom';
import {reduxForm, Field} from 'redux-form';

import Logo from '../logo';
import LabeledInput from '../labeled-input';
import TagsInput from './tags-input';

class EditorViewEdit extends React.Component {
  handleClick(e) {
    console.log(e.target.id);
    //this.props.dispatch(removeHiddenClass())
  }
  onSubmit(values){
    console.log(values);
    {/* AJAX call with new PUT request
      if successful,
      this.props.dispatch(editContent())
    */}
  }
  render(){
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
      <section id="editor-view-edit" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <span className="back">E</span>
          <form
            className="clear-fix"
            onSubmit={this.props.handleSubmit(values =>this.onSubmit(values))}
          >
            <div
              id="view-artist-name"
              onClick={this.handleClick.bind(this)}
            >
              Art Vandelay
            </div>
            <Field
              id="edit-artist-name"
              className="hidden"
              name="artistName"
              component={LabeledInput}
              type="text"
              label="Artist Name"
            />
            <div
              id="view-artist-title"
              onClick={this.handleClick.bind(this)}
            >
              Arty Art
            </div>
            <Field
              id="edit-artist-title"
              className="hidden"
              name="title"
              component={LabeledInput}
              type="text"
              label="Title"
            />
            <div
              id="view-art"
              onClick={this.handleClick.bind(this)}
            >
              actual art
            </div>
            <Field
              id="edit-art"
              className="hidden"
              name="uploadArt"
              component={LabeledInput}
              type="file"
              label="Upload Art"
            />
            <div
              id="view-category"
              onClick={this.handleClick.bind(this)}
            >
              performance
            </div>
            <div
              id="edit-category"
              className="assign-category hidden"
              name="category"
            >
              <legend>Category</legend>
              {categoryInputs}
            </div>
            <div
              id="view-tags"
              onClick={this.handleClick.bind(this)}
            >
              lots of tags
            </div>
            <Field
              id="edit-tags"
              className="hidden"
              name="tagsInput"
              component={TagsInput}
              label="Tags"
            />
            <button
              className="float-right hidden"
              id="submitContentEdit"
              type="submit"
              value="Submit"
              >submit
            </button>
          </form>
        </main>
      </section>
    )
  }
}

export default reduxForm({
  form: 'editorEdit'
})(EditorViewEdit);
