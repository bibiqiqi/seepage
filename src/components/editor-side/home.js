import React from 'react';
import {connect} from 'react-redux';
import {logOut} from '../../actions/auth';
import Logo from '../multi-side/logo';
import './home.css'

function EditorHome(props) {
  const history = props.history;
  const currentEditor = props.currentEditor.firstName;
  const buttonDetails = [
    {
      text: 'upload new content',
      location: '/editor-upload'
    },
    {
      text: 'browse or search content',
      location: '/editor-find'
    },
    {
      text: 'add a new editor profile',
      location: '/editor-reg-form',
    }
  ];

  const buttons = buttonDetails.map((button, i) => {
    return (
      <button
        id={button.id}
        className='editor-buttons clickable'
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
    <section id="editor-home" className="screen">
      <Logo/>
      <main>
        <header>
          <p className='greeting'>hello, <span>{currentEditor}</span></p>
          <button
            className='sign-out'
            onClick={() => props.dispatch(logOut())}
          >Sign Out
          </button>
        </header>
        <div className="button-container">
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
