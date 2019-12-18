import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {API_BASE_URL} from '../../config';
import cloneDeep from 'clone-deep';

import TextIcon from '../../text-icon.jpg'
import ReactPlayer from 'react-player'
import Gallery from '../multi-side/gallery';

class ThumbNails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gallery: {
        open: false,
        firstArtIndex: null
      }
    }
    this.handleGalleryExit = this.handleGalleryExit.bind(this);
    this.handleGalleryOpen = this.handleGalleryOpen.bind(this);
    this.renderGalleryState = this.renderGalleryState.bind(this);
    this.renderThumbNails = this.renderThumbNails.bind(this);
  };

  handleGalleryOpen(e) {
    //updates the state with the objectId of the thumbNail that was chosen
    //and an array of the objectIds of all the other thumbNails so they can be sent to gallery component
    //and reveals the Gallery component
    const gallery = cloneDeep(this.state.gallery);
    gallery.firstArtIndex = e.currentTarget.id.slice(10);
    gallery.open = true;
    this.setState({gallery}, () => {console.log('handleGalleryClick ran and the updated state is:', this.state.gallery)});
  }

  handleGalleryExit(){
    //when user wants to exit the gallery
    //updates the state to hide the Gallery component
    const gallery = {
      open: false,
      firstArtIndex: ''
    }
    this.setState({gallery}, () => {console.log('handleGalleryExit ran and the updated state is:', this.state.gallery)});
  }

  renderGalleryState() {
    //determines whether to render Gallery component or hide it
    //dependent on whether use has clicked on a thumb nail
    if (this.state.gallery.open) {
      return (
        <Gallery
          firstArtIndex={this.state.gallery.firstArtIndex}
          fileObjects={this.props.fileObjects}
          onExitClick={this.handleGalleryExit}
          alt={(fileNumber) => `Gallery view of file ${fileNumber} for ${this.props.content.title}, by ${this.props.content.artistName}`}
         />
      )
    } else {
      return null
    }
  }

renderThumbNails() {
  const thumbNails = this.props.fileObjects.map((e, i) => {
    const url = `${API_BASE_URL}/content/files/${e.fileId}`;
    let thumbNail;
    if(e.type.includes('image')) {
      thumbNail =
         <img
           src={url}
         >
         </img>
    } else if (e.type.includes('video')) {
      thumbNail =
      <ReactPlayer
        url={url}
        muted
        width='100%'
        height='100%'
      />
    } else if (e.type.includes('pdf')) {
      thumbNail =
      <img
        src={TextIcon}
      >
      </img>
    };
    return (
      <div
        className='thumbNail'
        key={i}
        id={`thumbnail_${i}`}
        alt={`thumbNail ${i} for ${this.props.content.title}, by ${this.props.content.artistName}`}
        onClick={(e) => this.handleGalleryOpen(e)}
      >
        {thumbNail}
      </div>
    )
  });
  return thumbNails
 }

  render(){
    return(
      <Fragment>
        {this.renderThumbNails()}
        {this.renderGalleryState()}
      </Fragment>
    )
  }
}



const mapStateToProps = state => ({
  fileObjects: state.editorContent.fileIds
});

export default connect(mapStateToProps)(ThumbNails);
