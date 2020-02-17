import React from 'react';
import {Link} from 'react-router-dom';

import EditorFindForm from './find-form';
import EditorFindResults from './find-results';
import Logo from '../multi-side/logo';

export default function EditorFindPage() {
  //a skeleton of html that holds the EditorFindForm and EditorFindresults
  return (
    <section id="editor-find" className="screen">
      <Link to="/editor-home"><Logo/></Link>
      <main id="editor-browse-search">
        <EditorFindForm/>
        <EditorFindResults/>
      </main>
    </section>
  )
}
