import React from 'react';
import {Link} from 'react-router-dom';
import {Field, reduxForm, focus, reset} from 'redux-form';

import Logo from '../multi-side/logo';
import {registerEditor} from '../../actions/register';
import LabeledInput from '../multi-side/labeled-input-redux';
import {required, nonEmpty, matches, length, isTrimmed, email} from '../../validators';
import {renderAsyncState} from '../multi-side/user-feedback.js'
import './registration-form.css';

const passwordLength = length({min: 10, max: 72})
const matchesPassword = matches('password');

class EditorRegForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asyncCall: {
        loading: false,
        success: null
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.submitSucceeded) {
      const asyncCall = {loading: false, success: true};
      return {asyncCall}
    } else if (props.error) {
      const asyncCall = {loading: false, success: false};
      return {asyncCall}
    } else {
      return null
    }
  }

  onSubmit(values){
    const asyncCall = {loading: true, success: null};
    this.setState({asyncCall});
    const {email, firstName, lastName, password} = values;
    const editor = {email, firstName, lastName, password};
    return this.props.dispatch(registerEditor(editor));
  }

  render(){
    return (
      <section id="editor-reg" className="screen">
        <Link to="/editor-home"><Logo/></Link>
          <form
            className="clear-fix"
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
          {renderAsyncState(this.state.asyncCall, 'registration')}
            <div className="simple-form">
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
            </div>
            <button
              type="submit"
              disabled={this.props.pristine || this.props.submitting}
            >
              <i class="material-icons">person_add</i>
            </button>
          </form>
      </section>
    )
  }
}

export default reduxForm({
  form: 'editorRegister',
  onSubmitSuccess: (result, dispatch) => {
    dispatch(reset('editorRegister'));
  },
  onSubmitFail: (errors, dispatch) => {
    dispatch(focus('contact', Object.keys(errors)[0]))
  }
})(EditorRegForm);
