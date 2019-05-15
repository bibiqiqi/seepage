import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import Logo from '../logo';
import LoginForm from './login-form';

export function EditorLoginPage(props) {
    // If we are logged in (which happens automatically when registration
    // is successful) redirect to the user's dashboard
    //debugger;
    if (props.loggedIn) {
      return <Redirect to='/editor-home'/>
    };
    return (
      <section id="editor-login" className="page">
        <Logo/>
        <main>
          <LoginForm />
        </main>
      </section>
    );
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentEditor !== null
});

export default connect(mapStateToProps)(EditorLoginPage);
