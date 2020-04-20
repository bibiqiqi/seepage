import React from 'react';
import {connect} from 'react-redux';
import {API_BASE_URL} from '../../config';
import TextIcon from '../../text-icon.png';
import {openGalleryRequest} from '../../actions/content/multi-side'
import VideoPlayer from './video-player'

import './thumbnail.css';

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      thumbnailUrl: ''
    };
    this.handleGalleryOpen = this.handleGalleryOpen.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //console.log('componentDidUpdate running')
    if(prevProps !== this.props) {
      this.updateStateWithProps();
    }
  }

  componentDidMount() {
    //console.log('componentDidMount running')
    this.updateStateWithProps();
  }

  updateStateWithProps(){
    let url;
    if (this.props.fileObject.src) {//<Thumbnail> is being used to display an upload preview for an image
      url = this.props.fileObject.src
      this.setState({fileUrl: url});
    } else { //<Thumbnail> is being used to display file in DB or Youtube account
      if(this.props.fileObject.fileType.includes('video')) {
        url = this.props.fileObject.fileUrl;
        this.setState({fileUrl: url});
      } else {
        url = `${API_BASE_URL}/content/files/${this.props.fileObject.fileId}`;
        this.setState({fileUrl: url});
      }
    }
  }

  handleGalleryOpen() {
    //updates the state with the objectId of the thumbNail that was chosen
    //and an array of the objectIds of all the other thumbNails so they can be sent to gallery component
    //and reveals the Gallery component
    this.props.dispatch(openGalleryRequest(this.props.fileObjects, this.props.index));
  }

  render(){
    //if there's a src key in the fileObject, then Thumbnail component is being used to display an upload preview for an image
    //not in the db yet, otherwise, it's for an image that's in the db
    let thumbnail;
    if(this.props.fileObject.fileType.includes('image')) {
      thumbnail =
      <img className='img-fit' src={this.state.fileUrl} alt={`thumbnail ${this.props.index}`}></img>
    } else if (this.props.fileObject.fileType.includes('video')) {
      thumbnail =
        <VideoPlayer
          url={this.state.fileUrl}
          autoplay={this.props.autoplay}
        />
    } else if (this.props.fileObject.fileType.includes('pdf')) {
      thumbnail =
      <img className='text-icon' src={TextIcon} alt={`thumbnail ${this.props.index}`}></img>
    };
    return (
      <div
        className='thumbnail clickable'
        key={this.props.index}
        alt={`thumbnail ${this.props.index}`}
        onClick={() => {
          // console.log('thumbnail div also clicked. this.props.gallery is', this.props.gallery)
          if(this.props.gallery) {
            this.handleGalleryOpen()
          }
        }}
      >
        {thumbnail}
      </div>
    )
  }
}

export default connect()(Thumbnail);
