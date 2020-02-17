import React from "react";

export default function Trigger(props) {
  return (
    <h3 className='clickable'>
      <span className='title'>{props.title}</span> <span className='smaller'>by</span> {props.artistName}
    </h3>
  )
}
