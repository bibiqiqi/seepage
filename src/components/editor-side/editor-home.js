import React from 'react';
import {Link} from 'react-router-dom';

import Logo from '../logo';

export default class EditorHome extends React.Component {

  handleClick(e) {
    console.log(e.target.value)
    {/*this.props.dispatch(turnPage())*/};
  }

  render() {
    const buttonValues = [
      {
        text: 'upload new content',
        id: 'uploadCont'
      },
      {
        text: 'browse or search content',
        id: 'findCont'
      },
      {
        text: 'add a new editor profile',
        id: 'addEditor'
      }
    ];

  const buttons = buttonValues.map((e) => {
    return (
      <button
      id={e.id}
      onClick={this.handleClick.bind(this)}
      value={e.text}
      >
      {e.text}</button>
    )
  });

    return (
      <section id="editor-home" className="page">
        <Link to="/editor-home"><Logo/></Link>
        <main>
          <h3 className="editor-greeting">hello, <span>person</span></h3>
          <div>
            {buttons}
          </div>
        </main>
      </section>
    )
  }
}
