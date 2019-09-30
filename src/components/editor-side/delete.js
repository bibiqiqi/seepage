import React from 'react';

export default class DeleteContent extends React.Component(props) {

  handleClick(e) {
    console.log(e.target.value);
    {/*
      if (value === "keep") {
        {/* add hidden class by changing the state
        this.props.dispatch(removeDelete());
      }
      else {
        ajax call for DELETE request for this content
    }*/};
  }

  render(){
    return (
      <section
        id="editor-delete"
        className="pop-up hidden"
        role="region"
      >
        <h3>Delete?</h3>
        <button
          type="button"
          value="keep"
          onClick={this.handleClick.bind(this)}
        >No
        </button>
        <button
          type="button"
          value="delete"
          onClick={this.handleClick.bind(this)}
        >Yes
        </button>
      </section>
    )
  }
}
