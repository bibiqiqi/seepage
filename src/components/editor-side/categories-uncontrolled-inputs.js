import LabeledInput from '../labeled-input-uncontrolled';
import React from 'react';

export default function Categories(props) {
  console.log('categories props are', categories);
  const categories = props.categories;
  let i = 1;
  const categoryInputs = [];
  for (let key in categories) {
    if (categories.hasOwnProperty(key)) {
      categoryInputs.push(
        <LabeledInput
          name={key}
          type="checkbox"
          label={key}
          key={i}
          onChange={props.onChange}
          checked={categories[key]}
        />
      )
    }
    i++;
  }
  return (
    <div className="assign-category">
      <legend>Category</legend>
      {categoryInputs}
    </div>
  )
}
