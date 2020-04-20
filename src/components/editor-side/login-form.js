import React from 'react';
import {reduxForm, Field, focus} from 'redux-form';

import Logo from '../multi-side/logo';
import LabeledInput from '../multi-side/labeled-input-redux';
import {required, nonEmpty, email} from '../../validators';
import {login} from '../../actions/auth';
import {renderValidationWarnings, renderAsyncState} from '../multi-side/user-feedback.js'

import './login-form.css';

class EditorLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asyncCall: {
        loading: false,
        success: null
      },
      error: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.error) {
      const asyncCall = {loading: false, success: false};
      return {asyncCall}
    } else {
      return null
    }
  }

  onSubmit(values){
  //console.log('login values being submitted to server are', values);
    this.props.dispatch(login(values.email, values.password))
      .then(res => this.setState({error: null}))
      .catch(err => this.setState({error: err}))
  }

  render() {
    return (
      <section id="editor-login" className="screen
      ">
        <Logo/>
        <main>
          <form
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
          {renderValidationWarnings(this.state.error)}
          {renderAsyncState(this.state)}
            <div className="simple-form">
              <Field
                name="email"
                component={LabeledInput}
                type="email"
                label="Email"
                validate={[required, nonEmpty, email]}
              />
              <Field
                name="password"
                component={LabeledInput}
                type="password"
                label="Password"
                validate={[required, nonEmpty]}
              />
            </div>
            <button
              className="float-right"
              type="submit"
            >
            submit
          </button>
          </form>
        </main>
      </section>
    )
  }
}

export default reduxForm({
  form: 'editorLogin',
  onSubmitFail: (errors, dispatch) => {
    dispatch(focus('login', 'username'))
  }
})(EditorLoginForm);
