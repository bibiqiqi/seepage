import React from "react";

export default function Trigger(props) {
  return (
    <p>
      <span className='title'>{props.title}</span> <span className='smaller'>by</span> {props.artistName}
    </p>
  )
}
