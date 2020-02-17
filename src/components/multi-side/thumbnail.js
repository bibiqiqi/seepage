import React, {Fragment} from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import ReactPlayer from 'react-player';
import {connect} from 'react-redux';

import {API_BASE_URL} from '../../config';
import TextIcon from '../../text-icon.png';
import {openGalleryRequest} from '../../actions/content/multi-side'

import './thumbnail.css';

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      thumbnailUrl: '',
      loading: true
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

  handleGalleryOpen(e) {
    //updates the state with the objectId of the thumbNail that was chosen
    //and an array of the objectIds of all the other thumbNails so they can be sent to gallery component
    //and reveals the Gallery component
    this.props.dispatch(openGalleryRequest(this.props.fileObjects, this.props.index));
  }

  render(){
    //if there's a src key in the fileObject, then Thumbnail component is being used to display an upload preview for an image
    //not in the db yet, otherwise, it's for an image that's in the db
    let thumbnail;
    //console.log(this.props.fileObject);
    if(this.props.fileObject.fileType.includes('image')) {
      thumbnail =
      <img className='img-fit' src={this.state.fileUrl} alt={`thumbnail ${this.props.index}`}></img>
    } else if (this.props.fileObject.fileType.includes('video')) {
      thumbnail =
        <Fragment>
          <p>loading...</p>
          <ReactPlayer
            url={this.state.fileUrl}
            playing={this.props.playing}
            light={this.state.thumbnailUrl}
            width='100%'
            height='100%'
          />
        </Fragment>
    } else if (this.props.fileObject.fileType.includes('pdf')) {
      thumbnail =
      <img className='text-icon' src={TextIcon} alt={`thumbnail ${this.props.index}`}></img>
    };
    return (
      <div
        className='thumbnail clickable'
        key={this.props.index}
        id={`thumbnail_${this.props.index}_${this.props.title}`}
        alt={`thumbNail ${this.props.index} for ${this.props.title}, by ${this.props.artistName}`}
        onClick={(e) => {
          if(this.props.gallery) {this.handleGalleryOpen(e)}
        }}
      >
        {thumbnail}
      </div>
    )
  }
}

export default connect()(Thumbnail);
