import React from 'react';

export function EditorFindResults(props) {

  return (
    <div className = {props.className}>
      <h4>{props.title}</h4>
      <div className="results-preview">
      {...props.preview}
      </div>
    </div>
  )
}
