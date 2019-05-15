import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import CoverPage from './user-side/cover-page';
import Home from './user-side/home';
import EditorLoginPage from './editor-side/login-page';
import EditorHome from './editor-side/home';
import EditorUpload from './editor-side/upload';
import EditorFind from './editor-side/find';
import EditorViewEdit from './editor-side/view-edit';
import EditorRegForm from './editor-side/registration-form';

export default function App(props) {
  return (
    <Router>
      <div className="app">
        <section className="user-side">
          <Route exact path="/" component={CoverPage} />
          <Route exact path="/home" component={Home} />
        </section>
        <section className="editor-side">
          <Route exact path="/editor-login" component={EditorLoginPage} />
          <Route exact path="/editor-home" component={EditorHome} />
          <Route exact path="/editor-upload" component={EditorUpload} />
          <Route exact path="/editor-find" component={EditorFind} />
          <Route exact path="/editor-view-edit" component={EditorViewEdit} />
          <Route exact path="/editor-reg-form" component={EditorRegForm} />
        </section>
      </div>
    </Router>
  )
}
