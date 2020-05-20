import React from 'react';
import RenderDropZone from './dropzone';
import {Button} from '../multi-side/clickables';
import TextIcon from '../../text-icon.png';
import {validateUrl} from '../../validators.js';
import produce from 'immer';

import './file-url-input.css';

const initialState = {
  videoUrlInput: ''
}

export default class FileAndUrlInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = produce(initialState, draftState => {
      return draftState
    });
    this.handleFileInput = this.handleFileInput.bind(this);
    this.handleUrlAdd = this.handleUrlAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onCreateObjectUrl(object) { //generate an object url from object file
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
  }

  handleFileInput(event) {
    event.forEach(file => {
      if ((file.type.includes('image')) || (file.type.includes('pdf'))) {
        this.handleValidFile(file);
      } else {
        const files = 'File uploads have to be an image or pdf. For video files, upload to the Seepage Youtube account and submit the URL below.';
        this.props.onFileValidation(files)
      }
    })
  }

  handleValidFile(file) {
    const fileObject = {};
    fileObject.fileType = file.type;
    fileObject.file = file;
    this.setState(produce(draft => { //update the state with a new file object and thumbnailUrl object
      if (file.type.includes('image')) {
        fileObject.src = this.onCreateObjectUrl(file);
      } else if (file.type.includes('pdf')) {
        fileObject.src = TextIcon;
      };
    }));
    this.props.onFileOrUrlAdd(fileObject) //pass the file to Upload component
  }

  getId(url){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

  handleUrlAdd() {
    const videoUrl = this.state.videoUrlInput
    return validateUrl(videoUrl) //validate that the ID is a valid youtube ID
      .then(res => { //if validation comes back positive...
        const videoId = this.getId(videoUrl);
        const embed = `//www.youtube.com/embed/${videoId}`;
        console.log('embed is', embed)
        const urlObject = {};
        urlObject.fileType = 'video';
        urlObject.src = embed;
        urlObject.file = embed;
        this.props.onFileOrUrlAdd(urlObject) //call onFileOrUrlAdd() to pass URL to parent component
        this.setState(produce(draft => {
          draft.videoUrlInput = '';
        }));
      })
      .catch(validationWarning => { //if validation comes back negative, give validation feedback to user
        const url = validationWarning;
        this.props.onUrlValidation(url)
      })
  }

  handleChange(e) {
    const input = e.target.value
    this.setState(produce(draft => {
      draft.videoUrlInput = input;
    }));
  }

  render() {
    return(
      <div>
        <div className='upload-file-flex'>
          <RenderDropZone
            name="files"
            onDrop={this.handleFileInput}
          />
          <div className="add-video-url">
            <input
              className="video-url-input"
              name="videoUrls"
              placeholder="ID of Youtube Video"
              type="url"
              value={this.state.videoUrlInput}
              onChange={this.handleChange}
              noValidate
            />
            <Button
              className='clickable'
              handleClick={this.handleUrlAdd}
              glyph='add'
            />
          </div>
        </div>
      </div>
    )
  }
}
