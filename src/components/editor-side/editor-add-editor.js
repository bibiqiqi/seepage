import React from 'react';
import {Link} from 'react-router-dom';
import {Field, reduxForm, focus} from 'redux-form';
import {registerEditor} from '../../actions/register';
import {login} from '../../actions/auth';
import Logo from '../logo';
import LabeledInput from '../labeled-input';
import {required, nonEmpty, matches, length, isTrimmed, email} from '../../validators';
const passwordLength = length({min: 10, max: 72})
const matchesPassword = matches('password');

class EditorAddEditor extends React.Component {
  onSubmit(values){
    console.log(values);
    const {email, firstName, lastName, password} = values;
    const editor = {email, firstName, lastName, password};
    return this.props
     //{/*registerEditor makes ajax call to post to /register endpoint*/}
      .dispatch(registerEditor(editor))
      //{/*login() makes ajax call to post to /auth endpoint*/}
      .then(() => this.props.dispatch(login(email, password)));
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
              validate={[required, nonEmpty, isTrimmed, email]}
            />
            <Field
              name="firstName"
              component={LabeledInput}
              type="text"
              label="First Name"
              placeholder="Eddie"
              validate={[required, nonEmpty, isTrimmed]}
            />
            <Field
              name="lastName"
              component={LabeledInput}
              type="text"
              label="Last Name"
              placeholder="Editor"
              validate={[required, nonEmpty, isTrimmed]}
            />
            <Field
              name="password"
              component={LabeledInput}
              type="password"
              label="Password"
              validate={[required, passwordLength, isTrimmed]}
            />
            <Field
              name="passwordVer"
              component={LabeledInput}
              type="password"
              label="Password Verification"
              validate={[required, nonEmpty, matchesPassword]}
            />
            <button
              type="submit"
              className="float-right"
              disabled={this.props.pristine || this.props.submitting}
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
