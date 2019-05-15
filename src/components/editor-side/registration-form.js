import React from 'react';
import {Field, reduxForm, focus} from 'redux-form';

import {registerEditor} from '../../actions/register';
import {login} from '../../actions/auth';
import LabeledInput from '../labeled-input';
import {required, nonEmpty, matches, length, isTrimmed, email} from '../../validators';
const passwordLength = length({min: 10, max: 72})
const matchesPassword = matches('password');

class EditorRegForm extends React.Component {
  onSubmit(values){
    //console.log('the values you submitted are:', values);
    const {email, firstName, lastName, password} = values;
    const editor = {email, firstName, lastName, password};
    return this.props.dispatch(registerEditor(editor));
  }
  render(){
    return (
      <form
        className="clear-fix"
        onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
      >
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
    )
  }
}

export default reduxForm({
    form: 'editorRegister',
    onSubmitSuccess: (result, dispatch) => {
      console.log('success! and the result is:', result);
      //// TODO: figure out what to do after the user registers a new editor
      //turnPage('/editor-home', dispatch);
    },
    onSubmitFail: (errors, dispatch) => {
      console.log('failure! and the errors are:', errors);
      dispatch(focus('contact', Object.keys(errors)[0]))
    }
})(EditorRegForm);
