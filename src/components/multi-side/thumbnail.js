import React from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import ReactPlayer from 'react-player'

import {API_BASE_URL} from '../../config';
import TextIcon from '../../text-icon.png';

import '../../index.css'
import './thumbnail.css';

export default class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      thumbnailUrl: ''
    };
  }

  componentDidMount() {
    const url = this.props.fileObject.src? this.props.fileObject.src : `${API_BASE_URL}/content/files/${this.props.fileObject.fileId}`;
    this.setState({fileUrl: url});
    if (this.props.fileObject.fileType.includes('video')) {
      return(
        <VideoThumbnail
          renderThumbnail={false}
          videoUrl={this.state.fileUrl}
          width={100}
          thumbnailHandler={e => {
            this.setState({thumbnailUrl: e})
          }}
        />
      )
    }
  }

  render(){
    //if there's a src key in the fileObject, then Thumbnail component is being used to display an upload preview for an image
    //not in the db yet, otherwise, it's for an image that's in the db
    let thumbnail;
    if(this.props.fileObject.fileType.includes('image')) {
      thumbnail =
      <img className='thumbnail-fit' src={this.state.fileUrl} alt={`thumbnail ${this.props.index}`}></img>
    } else if (this.props.fileObject.fileType.includes('video')) {
      thumbnail =
        <ReactPlayer
          url={this.state.fileUrl}
          light={this.state.thumbnailUrl}
          width='100%'
          height='100%'
          controls
        />
    } else if (this.props.fileObject.fileType.includes('pdf')) {
      thumbnail =
      <img className='thumbnail-fit' src={TextIcon} alt={`thumbnail ${this.props.index}`}></img>
    };
    return (
      <div
        className='thumbnail'
        key={this.props.index}
        id={`thumbnail_${this.props.index}`}
        alt={`thumbNail ${this.props.index} for ${this.props.title}, by ${this.props.artistName}`}
        onClick={(e) => {if(this.props.gallery) {this.props.onGalleryOpen(e)}}}>
        {thumbnail}
      </div>
    )
  }
}
