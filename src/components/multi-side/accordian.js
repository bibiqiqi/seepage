import React from 'react';
import merge from 'deepmerge';
import cloneDeep from 'clone-deep';
import Collapsible from 'react-collapsible';

import EditorInnerCollapsible from '../editor-side/inner-collapsible';
import UserInnerCollapsible from '../user-side/inner-collapsible';
import Trigger from './trigger.js';
import genCatColor from './gen-cat-color';
import './accordian.css'

const initialState = {
  contentId: '',
  collapsible: {
    key: null,
    open: false,
  }
}

export default class Accordian extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
  }

  componentDidUpdate(prevProps) {
    if ((this.props.submits !== prevProps.submits) || (this.props.results !== prevProps.results) ) {
      const collapsible = {
        key: null,
        open: false
      };
      this.setState({collapsible})
    }
  }

  handleCollapsibleClick(contentId, key) {
    const collapsible = cloneDeep(this.state.collapsible);
    //if a user clicks a collapsible and one of them is open...
    if (collapsible.open) {
      //test to see if the one that's open equals the one clicked
      if (key === collapsible.key) {
        collapsible.open = false
        //if so, update the state to reflect that the user is closing that collapsible
        this.setState({collapsible})
      } else {
        //if not, that means the user is trying to open a different collapsible
        //so, update the state and call fetchThumbnails for the new collapsible
        const newCollapsible = {
          contentId: contentId,
          collapsible: {
            key: key
          }
        }
        this.setState((prevState) => {
          return merge(prevState, newCollapsible)
        });
      }
    //if user clicks a collapsible that's closed...
    } else {
      //update the state to relect that a collapsible is open and with the corresponding key
    //console.log('updating the state to open the collapsible');
      const newState = {
        contentId: contentId,
        collapsible: {
          key: key,
          open: true
        }
      }
      this.setState((prevState) => {
        return merge(prevState, newState)
      });
   };
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
        onCloseCollapsible={() => {this.setState({collapsible: {key: null, open: false}})}}
      />
  } else {
    innerCollapsible =
      <EditorInnerCollapsible
        openState={openState}
        content={result}
        index={index}
      />
  }
  return innerCollapsible
}


  render() {
    const results = this.props.results;
    //maps through all the filtered results from user's search and calls other functions to
    //render all of the code within a collapsible
    const collapsibles = results.map((result, index) => {
      const openState = this.state.collapsible.open && this.state.collapsible.key===index;
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
            handleTriggerClick={(e) => this.handleCollapsibleClick(result.id, index, result.contentType)}
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
