import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';

export default class EditorFileViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  renderRemoveSymbol(index) {
    //console.log('value being passed to renderDeleteSymbol is', value);
     return(
       <span
         className = {classnames('exit', 'remove-files')}
         onClick = {(e) => this.props.handleExitClick(e)}
       >T</span>
     )
   }

  render(){
    return (
      <div
        className='fileViewer'
      >
        {this.renderRemoveSymbol()}
        <img
        src={this.props.url}
        height='1000'
        width='1000'
        />
      </div>
    )
  }
}
