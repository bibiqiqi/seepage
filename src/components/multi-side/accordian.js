import React from 'react';
import produce from 'immer';
import Collapsible from 'react-collapsible';

import EditorInnerCollapsible from '../editor-side/inner-collapsible';
import UserInnerCollapsible from '../user-side/inner-collapsible';
import Trigger from './trigger.js';
import genCatColor from './gen-cat-color';
import './accordian.css'

export default class Accordian extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsible: []
    }
  }

  componentDidUpdate(prevProps) { //this is so that all Accordian panels close when new search is submitted
    if ((this.props.submits !== prevProps.submits) || (this.props.results !== prevProps.results) ) {
      const collapsible = [];
      this.setState({collapsible})
    }
  }

  handleCollapsibleClick(key) {
    this.setState(
      produce(draft => {
        if (draft.collapsible.includes(key)) {
          draft.collapsible.splice(draft.collapsible.findIndex(el => el === key), 1);
        } else {
          draft.collapsible.push(key)
        }
      }))
  }

  handleCollapsibleClose(key) {
    this.setState(
      produce(draft => {
        draft.collapsible.filter(function(value, index){return value !== key;})
      })
    )
  }

renderInnerCollapsible(openState, result, index, color){
  let innerCollapsible;
  if(this.props.side === 'user') {
    innerCollapsible =
      <UserInnerCollapsible
        openState={openState}
        content={result}
        index={index}
        color={color}
      />
  } else {
    innerCollapsible =
      <EditorInnerCollapsible
        openState={openState}
        content={result}
        index={index}
        onCloseCollapsible={(e) => this.handleCollapsibleClose(index)}
      />
  }
  return innerCollapsible
}


  render() {
    const results = this.props.results;
    //maps through all the filtered results from user's search and calls other functions to
    //render all of the code within a collapsible
    const collapsibles = results.map((result, index) => {
      const openState = this.state.collapsible.includes(index);
      const color = genCatColor(result.category, .5);
      return (
        <li key={index} className='clickable' style={{'backgroundColor': color, 'borderLeft': '5px solid' + color}}>
          <Collapsible
            open={openState}
            trigger={
              <Trigger
               title={result.title}
               artistName={result.artistName}
              />
            }
            handleTriggerClick={(e) => this.handleCollapsibleClick(index)}
          >
          {this.renderInnerCollapsible(openState, result, index, color)}
          </Collapsible>
        </li>
      )
    })
    return (
      <div className='collaps-container'>
        {collapsibles}
      </div>
    )
  }
}
