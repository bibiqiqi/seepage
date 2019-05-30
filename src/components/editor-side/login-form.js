import React from 'react';
import {reduxForm, Field, focus} from 'redux-form';

import Logo from '../logo';
import LabeledInput from '../labeled-input';
import {required, nonEmpty, email} from '../../validators';
import {login} from '../../actions/auth';

export class EditorLoginForm extends React.Component {
  onSubmit(values){
    //console.log(values);
    //{/*login() makes ajax call to post to /auth endpoint*/}
    this.props.dispatch(login(values.email, values.password));
  }
  render() {
    let successMessage;
    if (this.props.submitSucceeded) {
      successMessage = (
        <div className="message message-success">
          Message submitted successfully
        </div>
      )
    }
    let errorMessage;
    if (this.props.error) {
      errorMessage = (
        <div className="message message-error">{this.props.error}</div>
      )
    }

    return (
      <section id="editor-login" className="page">
        <Logo/>
        <main>
          <form
            className="clear-fix"
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
            {successMessage}
            {errorMessage}
            <Field
              name="email"
              component={LabeledInput}
              type="email"
              label="Email"
              placeholder="EddieEditor@places.com"
              validate={[required, nonEmpty, email]}
            />
            <Field
              name="password"
              component={LabeledInput}
              type="password"
              label="Password"
              validate={[required, nonEmpty]}
            />
            <Field
              name="rememberMe"
              component={LabeledInput}
              type="checkbox"
              label="Remember Me"
            />
            <button
              className="float-right"
              type="submit"
              id="login-submit"
            >Enter
            </button>
            <Field
              name="forgot-password"
              component={LabeledInput}
              type="checkbox"
              label="Forgot Password?"
            />
          </form>
        </main>
      </section>

    )
  }
}

export default reduxForm({
  form: 'editorLogin',
  onSubmitFail: (errors, dispatch) => {
    console.log('failure! and the errors are:', errors);
    dispatch(focus('login', 'username'))
  }
})(EditorLoginForm);
