import React from 'react';
import {Link} from 'react-router-dom';
import Gallery from '../multi-side/gallery';
import {connect} from 'react-redux';
import {closeGallery} from '../../actions/content/multi-side'
import {filterContentSuccess} from '../../actions/content/editor-side'

import EditorFindForm from './find-form';
import EditorFindResults from './find-results';
import Logo from '../multi-side/logo';

export class EditorFindPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleGalleryExit = this.handleGalleryExit.bind(this);
  }

  componentDidMount(){
    //updates the Redux state with current content in DB and maps suggestedArtists
    //suggestedTitles, and suggestedTags to local state
    this.props.dispatch(filterContentSuccess([]));
  }

  handleGalleryExit() {
    //when user wants to exit the gallery
    //updates the state to hide the Gallery component
    this.props.dispatch(closeGallery());
  }

  renderGallery() {
    //determines whether to render Gallery component or hide it
    //dependent on whether use has clicked on a thumb nail
      return (
        <section id="gallery" className="screen">
          <Gallery
            firstArtIndex={this.props.galleryStarting}
            fileObjects={this.props.galleryFiles} //bc this can be triggered by onMouseLeave, new render of Gallery receives fileObjects from internal state
            onExitClick={this.handleGalleryExit}
            alt={(currentArtIndex) => `Gallery view of file ${currentArtIndex} for ${this.props.galleryFiles[currentArtIndex].title}, by ${this.props.galleryFiles[currentArtIndex].artist}`}
           />
        </section>
      )
    }

  renderPage(){
    return (
      <section id="editor-find" className="screen">
        <Link to="/editor-home"><Logo/></Link>
        <main id="editor-browse-search">
          <EditorFindForm/>
          <EditorFindResults/>
        </main>
      </section>
    )
  }
  //a skeleton of html that holds the EditorFindForm and EditorFindresults
  render(){
    if (this.props.galleryFiles.length) {
      return this.renderGallery()
    } else {
      return this.renderPage()
    }
  }
}

const mapStateToProps = (state) => ({
  galleryFiles: state.editorContent.galleryFiles,
  galleryStarting: state.editorContent.galleryStarting
})

export default connect(mapStateToProps)(EditorFindPage);
