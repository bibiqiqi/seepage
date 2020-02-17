import React from 'react';

export default function LabeledInput(props) {
  return (
    <label className = {props.className}>
      <input
        checked={props.checked}
        name={props.name}
        type="checkbox"
        onChange={(e) => props.onChange(e)}
      />
      {props.label}</label>
   )
}
