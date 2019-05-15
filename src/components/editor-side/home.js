import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Logo from '../logo';

export function  EditorHome(props) {
  const history = props.history;
  const currentEditor = props.currentEditor.firstName;
  const buttonValues = [
    {
      id: 'uploadCont',
      text: 'upload new content',
      location: '/editor-upload'
    },
    {
      id: 'findCont',
      text: 'browse or search content',
      location: '/editor-find'
    },
    {
      id: 'addEditor',
      text: 'add a new editor profile',
      location: '/editor-reg-form',
    }
  ];

  const buttons = buttonValues.map((button, i) => {
    return (
      <button
        id={button.id}
        onClick={() => {
          history.push(button.location);
        }}
        value={button.text}
        path={button.location}
        key={i}
     >
      {button.text}
    </button>
    )
  });

  return (
    <section id="editor-home" className="page">
      <Link to="/editor-home"><Logo/></Link>
      <main>
        <h3 className="editor-greeting">hello, <span>{currentEditor}</span></h3>
        <div>
          {buttons}
        </div>
      </main>
    </section>
  )
}

const mapStateToProps = state => ({
  currentEditor: state.auth.currentEditor
});

export default connect(mapStateToProps)(EditorHome);
