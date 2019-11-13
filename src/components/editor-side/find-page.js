import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditorFindForm from './find-form';
import EditorFindResults from './find-results';
import Logo from '../logo';
import './find.css';

export default class EditorFindPage extends React.Component {
  //a skeleton of html that holds the EditorFindForm and EditorFindresults
  render(){
    return (
      <section id="editor-find" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main id="editor-browse-search">
          <NavLink
            to='editor-home'
            className="back"
          >E
          </NavLink>
          <ToastContainer
            hideProgressBar
            autoClose={5000}
          />
          <EditorFindForm/>
          <EditorFindResults/>
        </main>
      </section>
    )
  }
}
