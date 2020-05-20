import React from 'react';
import {Link} from 'react-router-dom';
import Gallery from '../multi-side/gallery';
import {connect} from 'react-redux';
import {closeGallery} from '../../actions/content/multi-side'

import EditorFindForm from './find-form';
import EditorFindResults from './find-results';
import Logo from '../multi-side/logo';

export function EditorFindPage(props) {

  const handleGalleryExit = () => {
    //when user wants to exit the gallery
    //updates the state to hide the Gallery component
    props.dispatch(closeGallery());
  }

  const renderGallery = () => {
    //determines whether to render Gallery component or hide it
    //dependent on whether use has clicked on a thumb nail
      return (
        <section id="gallery" className="screen">
          <Gallery
            firstArtIndex={props.galleryStarting}
            fileObjects={props.galleryFiles} //bc this can be triggered by onMouseLeave, new render of Gallery receives fileObjects from internal state
            onExitClick={handleGalleryExit}
            alt={(currentArtIndex) => `Gallery view of file ${currentArtIndex} for ${props.galleryFiles[currentArtIndex].title}, by ${props.galleryFiles[currentArtIndex].artist}`}
           />
        </section>
      )
    }

  const renderPage = () => {
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
  if (props.galleryFiles.length) {
    return renderGallery()
  } else {
    return renderPage()
  }
}

const mapStateToProps = (state) => ({
  galleryFiles: state.editorContent.galleryFiles,
  galleryStarting: state.editorContent.galleryStarting
})

export default connect(mapStateToProps)(EditorFindPage);
