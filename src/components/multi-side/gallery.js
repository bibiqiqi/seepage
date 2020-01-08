import React from 'react';
import * as classnames from 'classnames';
import ReactPlayer from 'react-player'
import {API_BASE_URL} from '../../config';

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
  }

  renderFile(){
    const fileObject = this.props.fileObjects[this.state.currentArtIndex];
    //console.log('calling renderFile and the file array being passed is', this.props.fileObjects)
    const url = `${API_BASE_URL}/content/files/${fileObject.fileId}`;
    let file;
    if(fileObject.fileType.includes('image')) {
      file =
       <img
         src={url}
         alt={this.props.alt(this.state.currentArtIndex)}
       />
    } else if (fileObject.fileType.includes('video')) {
      file = <ReactPlayer url={url} controls/>
    } else if (fileObject.fileType.includes('pdf')) {
      file =
        <object onLoad={() => {this.setState({loadingSymbol: true})}} data={url} type="application/pdf">
          <p class={classnames({hidden: this.state.loadingSymbol})}>loading</p>
          <iframe src={`https://docs.google.com/viewer?url=${url}&embedded=true`} title='PDF viewer'></iframe>
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
          className = {classnames('exit', 'float-right', 'clickable')}
          onClick = {() => this.props.onExitClick()}
        >
          <i class="material-icons">close</i>
        </span>
        <span
          className={classnames('slider-back', 'arrow', 'clickable')}
          onClick={() => this.handleArrowClick('back')}
        >
          <i class="fa fa-angle-left"></i>
        </span>
        <span
          className={classnames('slider-forward', 'arrow', 'clickable')}
          onClick={() => this.handleArrowClick('forward')}
        >
          <i class="fa fa-angle-right"></i>
        </span>
        {this.renderFile()}
      </div>
    )
  }
}