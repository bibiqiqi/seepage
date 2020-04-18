import React from 'react';
import {MobilePDFReader, PDFReader} from 'reactjs-pdf-reader';
import {API_BASE_URL} from '../../config';
import {Button} from './clickables';
import VideoPlayer from './video-player'

import './gallery.css';

export default class Gallery extends React.Component {
  //renders a gallery viewer component for user to view the files of a content entry, one at a time
  //makes a GET request to stream a single file at a time
  constructor(props) {
    super(props);
    this.state = {
      currentArtIndex: this.props.firstArtIndex,
      loadingSymbol: false
    }
    this.renderFile = this.renderFile.bind(this);
    this.handleArrowClick = this.handleArrowClick.bind(this);
  }

  handleArrowClick(direction) {
    //increments or decrements the currentArtIndex, updates the state, and makes GET request for current file
    const fileObjects = this.props.fileObjects;
    const highestIndex = fileObjects.length-1
    let oldArtIndex = parseInt(this.state.currentArtIndex, 10);
    let currentArtIndex;
    if(direction === 'back') {
      //if the oldArtIndex is NOT zero, decrement it,
      //otherwise the index number is looping around to the end of array
      currentArtIndex = oldArtIndex? --oldArtIndex : highestIndex;
    } else { //direction === 'forward'
      //if the oldArtIndex is less than the highestIndex, increment it,
      //otherwise the index number is looping around to the front of the array;
      currentArtIndex = (oldArtIndex < highestIndex)? ++oldArtIndex : 0;
    }
    this.setState({currentArtIndex});
  }

  renderFile(){
    const fileObject = this.props.fileObjects[this.state.currentArtIndex];
    const url = `${API_BASE_URL}/content/files/${fileObject.fileId}`;
    let file;
    if(fileObject.fileType.includes('image')) {
      file =
       <img
         src={url}
         alt={this.props.alt(this.state.currentArtIndex)}
       />
    } else if (fileObject.fileType.includes('video')) {
      file =
        <VideoPlayer
          url={fileObject.fileUrl}
          autoplay={1}
        />
    } else if (fileObject.fileType.includes('pdf')) {
      if(window.innerWidth < 992) {
        file =
        <div className="pdf-viewer">
          <MobilePDFReader
            url={url}
            scale={.5}
            isShowHeader={false}
          />
        </div>
      } else {
        file =
          <PDFReader
            url={url}
            scale={1}
            showAllPage={true}
          />
      }
    };
    return file
   }

  render(){
    return (
      <div
        className='gallery'
      >
        <Button
          classNames='exit clickable'
          handleClick={this.props.onExitClick}
          glyph='close'
        />
        <div className="gallery-flexbox">
          <Button
            classNames='slider-back arrow clickable'
            handleClick={() => this.handleArrowClick('back')}
            glyph='keyboard_arrow_left'
          />
            {this.renderFile()}
            <Button
              classNames='slider-forward arrow clickable'
              handleClick={() => this.handleArrowClick('forward')}
              glyph='keyboard_arrow_right'
            />
        </div>
      </div>
    )
  }
}
