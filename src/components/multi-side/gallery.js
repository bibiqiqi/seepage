import React from 'react';
import * as classnames from 'classnames';
import ReactPlayer from 'react-player'
import {API_BASE_URL} from '../../config';

export default class Gallery extends React.Component {
  //renders a gallery viewer component for user to view the files of a content entry, one at a time
  //makes a GET request to stream a single file at a time
  constructor(props) {
    super(props);
    this.state = {
      currentArtIndex: this.props.firstArtIndex,
    }
    this.renderFile = this.renderFile.bind(this);
    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.renderFile = this.renderFile.bind(this);
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
    //this.fetchFile(fileObjects[currentArtIndex])
  }

  renderFile(){
    const fileObject = this.props.fileObjects[this.state.currentArtIndex];
    const url = `${API_BASE_URL}/content/files/${fileObject.fileId}`;
    let file;
    if(fileObject.type.includes('image')) {
      file =
       <img
         src={url}
         alt={this.props.alt(this.state.currentArtIndex)}
       />
    } else if (fileObject.type.includes('video')) {
      file = <ReactPlayer url={url} controls/>
    } else if (fileObject.type.includes('pdf')) {
      file =
      <object data={url} type="application/pdf">
        <iframe src={`https://docs.google.com/viewer?url=${url}&embedded=true`}></iframe>
      </object>
    };
    return file
   }

  render(){
    return (
      <div
        className='gallery'
      >
        <span
          className = {classnames('exit', 'exit-gallery')}
          onClick = {() => this.props.onExitClick()}
        >T
        </span>
        <span
          className={classnames('slider-back', 'arrow')}
          onClick={() => this.handleArrowClick('back')}
        >E
        </span>
        <span
          className={classnames('slider-forward', 'arrow')}
          onClick={() => this.handleArrowClick('forward')}
        >F
        </span>
        {this.renderFile()}
      </div>
    )
  }
}
