import React from 'react';
import {Link} from 'react-router-dom';
import {reduxForm, Field} from 'redux-form';

import Logo from '../logo';
import LabeledInput from '../labeled-input';

class EditorAddEditor extends React.Component {
  onSubmit(values){
    console.log(values);
    {/* AJAX call with new editor info
      if successful,
      this.props.dispatch(addEditor())
    */}
  }
  render(){
{/*
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
   */}
    return (
      <section id="editor-add-editor" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <span className="back">E</span>
          <form
            className="clear-fix"
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
{/*
          {successMessage}
          {errorMessage}
*/}
            <Field
              name="email"
              component={LabeledInput}
              type="email"
              label="Email"
              placeholder="EddieEditor@places.com"
            />
            <Field
              name="firstName"
              component={LabeledInput}
              type="text"
              label="First Name"
              placeholder="Eddie"
            />
            <Field
              name="lastName"
              component={LabeledInput}
              type="text"
              label="Last Name"
              placeholder="Editor"
            />
            <Field
              name="password"
              component={LabeledInput}
              type="password"
              label="Password"
            />
            <Field
              name="passwordVer"
              component={LabeledInput}
              type="password"
              label="Password"
            />
            <button
              type="submit"
              className="float-right"
            >Submit
            </button>
          </form>
        </main>
      </section>
    )
  }
}

export default reduxForm({
  form: 'editorAddEditor'
})(EditorAddEditor);
