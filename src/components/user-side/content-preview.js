import React from 'react';

import Thumbnail from '../multi-side/thumbnail';
import './content-preview.css'

export default class ContentPreview extends React.Component {
  //renders a gallery viewer component for user to view the files of a content entry, one at a time
  //makes a GET request to stream a single file at a time

  renderThumbNail() {
    if(this.props.node.type === 'secondary') {
      let height;
      //console.log('height is', height)
      return (
        <g className='graph-thumbnail clickable'>
          <foreignObject
            x='0em' y='0em'
            width='100'
            height='3.5rem'
            id={`thumbnail`}
            alt={`thumbnail for ${this.props.node.title}, by ${this.props.node.artist}`}
          >
            <Thumbnail
              fileObject={this.props.node.files[0]}
              fileObjects={this.props.node.files}
              index={0}
              title={this.props.node.title}
              artistName={this.props.node.artistName}
              gallery={true}
              autoplay={1}
            />
         </foreignObject>
       </g>
      )
    } else {
      return null
    }
  }

  renderText(){
    let text;
    if(this.props.node.type === "primary"){
      text =
        <text x='0em' y='1em'>{this.props.node.tag}</text>
    } else {
      if(window.innerWidth >= 992) {//desktop
      text =
        <g>
          <text className='title' x='0em' y='6.5em'>{this.props.node.title}</text>
          <text className='smaller' x='0em' y='9.85em'>by</text>
          <text x='1em' y='7.5em'>{this.props.node.artistName}</text>
        </g>
      } else if (window.innerWidth >= 768) {//tablets
        text =
          <g>
            <text className='title' x='0em' y='7.5em'>{this.props.node.title}</text>
            <text className='smaller' x='0em' y='16.75em'>by</text>
            <text x='.75em' y='8.5em'>{this.props.node.artistName}</text>
          </g>
      } else if (window.innerWidth >= 600) {//larger phones
        text =
        <g>
          <text className='title' x='0em' y='7.75em'>{this.props.node.title}</text>
          <text className='smaller' x='0em' y='17em'>by</text>
          <text x='.75em' y='8.75em'>{this.props.node.artistName}</text>
        </g>
      } else { //phones
        text =
        <g>
          <text className='title' x='0em' y='6em'>{this.props.node.title}</text>
          <text className='smaller' x='0em' y='13.5em'>by</text>
          <text x='.75em' y='7em'>{this.props.node.artistName}</text>
        </g>
      }
    }
    return text
  }

  render(){
    return(
      <svg
        x="1em"
        y="1em"
        className={`node-preview nodePreview-${this.props.node.index}`}
      >
        <g>
          {this.renderThumbNail()}
          {this.renderText()}
        </g>
      </svg>
    )
  }
}
