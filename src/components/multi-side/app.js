import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import CoverPage from '../user-side/cover-page';
import Home from '../user-side/home';
import EditorLoginForm from '../editor-side/login-form';
import EditorHome from '../editor-side/home';
import EditorUpload from '../editor-side/upload';
import EditorFindPage from '../editor-side/find-page';
import EditorRegForm from '../editor-side/registration-form';

export function App(props) {

  function renderEditorSide() {
    //if editor is already logged in, redirect any login urls to the editor home page
    if (props.loggedIn) {
      const urlPaths = ["/editor-home", "/editor-login"];
      const editorHome = urlPaths.map((e, i) => {return <Route path={e} key={i} component={EditorHome}/>})
      return (
        <Fragment>
          {editorHome}
          <Route exact path="/editor-upload" component={EditorUpload}/>
          <Route exact path="/editor-find" component={EditorFindPage}/>
          <Route exact path="/editor-reg-form" component={EditorRegForm}/>
        </Fragment>
      )
    } else {
      //otherwise, redirect all attempts to navigate to the editor pages to the login page
      const urlPaths = ["/editor-login", "/editor-upload", "/editor-find", "/editor-reg-form", "/editor-home" ];
      const editorLogin = urlPaths.map((e, i) => {return <Route path={e} key={i} component={EditorLoginForm}/>})
      return (
        <Fragment>
          {editorLogin}
        </Fragment>
      )
    }
  }

  return (
    <Router>
      <div className="app">
        <section className="user-side">
          <Route exact path="/" component={CoverPage} />
          <Route exact path="/home" component={Home} />
        </section>
        <section className="editor-side">
          {renderEditorSide()}
        </section>
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentEditor
});

export default connect(mapStateToProps)(App);
