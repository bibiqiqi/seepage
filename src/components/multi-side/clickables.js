import React from 'react';
import './clickables.css'

export function Button(props) {
  const text = props.text? <p>{props.text}</p> : null;
   return(
     <button
      className={props.classNames}
      type="button"
      onClick={props.handleClick}
     >
     {text}
      <i className="material-icons">{props.glyph}</i>
     </button>
   )
}

export function InlineClick(props) {
  const text = props.text? <p>props.text</p> : null;
   return(
     <button className="inline-button">
      {text}
      <i
        className={props.classNames}
        onClick={props.handleClick}
       >
        {props.glyph}
       </i>
     </button>
   )
}
