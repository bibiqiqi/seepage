import React, {Fragment} from 'react';
import cloneDeep from 'clone-deep';

import Gallery from './gallery';
import Thumbnail from './thumbnail';

export default class Thumbnails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gallery: {
        open: false,
        firstArtIndex: null
      },

    }
    this.handleGalleryExit = this.handleGalleryExit.bind(this);
    this.handleGalleryOpen = this.handleGalleryOpen.bind(this);
    this.renderGalleryState = this.renderGalleryState.bind(this);
    this.renderThumbnails = this.renderThumbnails.bind(this);
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
          fileObjects={this.props.content.files}
          onExitClick={this.handleGalleryExit}
          alt={(fileNumber) => `Gallery view of file ${fileNumber} for ${this.props.content.title}, by ${this.props.content.artistName}`}
         />
      )
    } else {
      return null
    }
  }

renderThumbnails() {
  const thumbnails = this.props.content.files.map((e, i) => {
    return (
      <Thumbnail
        fileObject={e}
        index={i}
        title={this.props.content.title}
        artistName={this.props.content.artistName}
        gallery={this.props.gallery}
        onGalleryOpen={this.handleGalleryOpen}
      />
    )
  });
  return thumbnails
 }

  render(){
    return(
      <Fragment>
        {this.renderThumbnails()}
        {this.renderGalleryState()}
      </Fragment>
    )
  }
}
