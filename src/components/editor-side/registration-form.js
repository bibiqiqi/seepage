import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Field, reduxForm, focus, reset} from 'redux-form';
import {ToastContainer, toast} from 'react-toastify';

import Logo from '../multi-side/logo';
import {registerEditor} from '../../actions/register';
import LabeledInput from '../multi-side/labeled-input-redux';
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
      <section id="editor-reg" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main id="reg-editor-form">
          <NavLink
            to='editor-home'
            className="back"
          >E
          </NavLink>
          <ToastContainer
            hideProgressBar
            autoClose={5000}
          />
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
        </main>
      </section>
    )
  }
}

export default reduxForm({
  form: 'editorRegister',
  onSubmitSuccess: (result, dispatch) => {
    dispatch(reset('editorRegister'));
    toast('you successfully registered a new editor!');
  },
  onSubmitFail: (errors, dispatch) => {
    dispatch(focus('contact', Object.keys(errors)[0]))
  }
})(EditorRegForm);
