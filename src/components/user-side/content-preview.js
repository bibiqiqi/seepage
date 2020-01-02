import React from 'react';
import {connect} from 'react-redux';
import ReactPlayer from 'react-player'

import TextIcon from '../../text-icon.png'
import {API_BASE_URL} from '../../config';
import './content-preview.css'

class ContentPreview extends React.Component {
  //renders a gallery viewer component for user to view the files of a content entry, one at a time
  //makes a GET request to stream a single file at a time

  renderThumbNailState() {
    if(this.props.node.type === 'secondary') {
      console.log('returning thumbNails')
      //if the redux state of fileIds is populated, then generate html from them
      const thumbNails = this.props.node.files.map((e, i) => {
        let x = 0;
        let thumbNail;
        const url = `${API_BASE_URL}/content/files/${e.fileId}`;
        if(e.fileType.includes('image')) {
          thumbNail =
          <image
            x={`${x}em`} y='0em'
            href={url}
            width='150'
            height='150'
            id={`thumbnail_${i}`}
            alt={`thumbnail ${i} for ${this.props.node.title}, by ${this.props.node.artist}`}
          />;
        } else if (e.fileType.includes('video')) {
          thumbNail =
          <foreignObject
            x={`${x}em`} y='0em'
            width='150'
            height='150'
            id={`thumbnail_${i}`}
            alt={`thumbnail ${i} for ${this.props.node.title}, by ${this.props.node.artist}`}
          >
            <ReactPlayer
              url={url}
              playing
              muted
              width='100%'
              height='100%'
            />
          </foreignObject>
        } else if (e.fileType.includes('pdf')) {
          thumbNail =
          <image
            x={`${x}em`} y='1em'
            href={TextIcon}
            width='85'
            height='85'
            id={`thumbnail_${i}`}
            alt={`thumbnail ${i} for ${this.props.node.title}, by ${this.props.node.artist}`}
          />;
        }
        console.log('returning', thumbNail);
        x++;
        return (
          <g class='preview clickable'>
           {thumbNail}
         </g>
        )
      });
      console.log('returning', thumbNails);
      return thumbNails
    } else {
      return null
    }
  }

  render(){
    let text;
    if(this.props.node.type === "primary"){
      text =
        <text x='1em' y='1em'>{this.props.node.tag}</text>
    } else {
      text =
      <g>
        <text className='graph-prev title' x='1em' y='7.5em'>{this.props.node.title}</text>
        <text className='graph-prev artistName' x='1em' y='8.5em'>{this.props.node.artistName}</text>
      </g>
    };
    return(
      <svg
        class={`nodePreview nodePreview-${this.props.node.index}`}
      >
        {this.renderThumbNailState()}
        {text}
      </svg>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.userContent.loading,
  error: state.userContent.error
});

export default connect(mapStateToProps)(ContentPreview);
