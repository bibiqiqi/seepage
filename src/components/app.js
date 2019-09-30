import React from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import CoverPage from './user-side/cover-page';
import Home from './user-side/home';
import EditorLoginForm from './editor-side/login-form';
import EditorHome from './editor-side/home';
import EditorUpload from './editor-side/upload';
import EditorFindPage from './editor-side/find-page';
import EditorRegForm from './editor-side/registration-form';

export function App(props) {
  return (
    <Router>
      <div className="app">
        <section className="user-side">
          <Route exact path="/" component={CoverPage} />
          <Route exact path="/home" component={Home} />
        </section>

        <section className="editor-side">
          <Route exact path="/editor-home" component={EditorHome} />
          <Route exact path="/editor-login" render={() => (
            props.loggedIn ? (
              <Redirect to="/editor-home"/>
            ) : (
              <EditorLoginForm/>
            )
          )}/>
          <Route exact path="/editor-upload" render={() => <EditorUpload/>} />
          <Route exact path="/editor-find" render={() => <EditorFindPage/>} />
          <Route exact path="/editor-reg-form" render={() => <EditorRegForm/>} />
        </section>
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentEditor !== null
});

export default connect(mapStateToProps)(App);
