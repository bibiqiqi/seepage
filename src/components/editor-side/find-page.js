import React from 'react';
import {Link} from 'react-router-dom';
import {SubmissionError} from 'redux-form';
import {connect} from 'react-redux';

import EditorFindForm from './find-form';
import EditorFindResults from './find-results';
import Logo from '../logo';
import './find.css';

class EditorFindPage extends React.Component {

  render(){
    return (
      <section id="editor-find" className="pop-up">
        <Link to="/editor-home"><Logo/></Link>
        <main id="editor-browse-search">
          <span className="back">E</span>
          <EditorFindForm/>
          <EditorFindResults/>
        </main>
      </section>
    )
  }
}

export default connect()(EditorFindPage);
