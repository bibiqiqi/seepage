import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import CoverPage from './user-side/cover-page';
import Home from './user-side/home';
import EditorLogin from './editor-side/editor-login';
import EditorHome from './editor-side/editor-home';
import EditorUpload from './editor-side/editor-upload';
import EditorFind from './editor-side/editor-find';
import EditorViewEdit from './editor-side/editor-view-edit';
import EditorAddEditor from './editor-side/editor-add-editor';

export default function App(props) {
  return (
    <Router>
      <div className="app">
        <section className="user-side">
          <Route exact path="/" component={CoverPage} />
          <Route exact path="/home" component={Home} />
        </section>
        <section className="editor-side">
          <Route exact path="/editor-login" component={EditorLogin} />
          <Route exact path="/editor-home" component={EditorHome} />
          <Route exact path="/editor-upload" component={EditorUpload} />
          <Route exact path="/editor-find" component={EditorFind} />
          <Route exact path="/editor-view-edit" component={EditorViewEdit} />
          <Route exact path="/editor-add-editor" component={EditorAddEditor} />
        </section>
      </div>
    </Router>
  )
}
