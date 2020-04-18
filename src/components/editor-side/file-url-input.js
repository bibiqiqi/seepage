import React from 'react';
import RenderDropZone from './dropzone';
import {Button} from '../multi-side/clickables';
import TextIcon from '../../text-icon.png';
import {validateUrl} from '../../validators.js';
import {renderValidationWarnings} from '../multi-side/user-feedback.js'
import produce from 'immer';

import './file-url-input.css';

const initialState = {
  videoUrlInput: '',
  validation: {
    file: '',
    url: ''
  }
}

export default class FileAndUrlInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = produce(initialState, draftState => {
      return draftState
    });
    this.handleFileInput = this.handleFileInput.bind(this);
    this.handleUrlAdd = this.handleUrlAdd.bind(this);
  }

  onCreateObjectUrl(object) { //generate an object url from object file
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
  }

  handleFileInput(event) {
    event.forEach(file => {
      if ((file.type.includes('image')) || (file.type.includes('pdf'))) {
        this.handleValidFile(file);
      } else {
        this.setState(produce(draft => {
          draft.validation.files = 'File uploads have to be an image or pdf. For video files, upload to the Seepage Youtube account and submit the URL below.' ;
        }));
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

  handleUrlAdd() {
    const videoId = this.state.videoUrlInput
    validateUrl(videoId) //validate that the ID is a valid youtube ID
      .then(res => { //if validation comes back positive...
          const urlObject = {};
          const videoUrl = `https://www.youtube.com/embed/${videoId}`;
          urlObject.fileType = 'video';
          urlObject.src = videoUrl;
          urlObject.file = videoUrl;
          this.props.onFileOrUrlAdd(urlObject) //call onFileOrUrlAdd() to pass URL to parent component
          this.setState(produce(draft => {
            draft.videoUrlInput = '';
          }));
      })
      .catch(validationErr => { //if validation comes back negative, give validation feedback to user
        this.setState(produce(draft => {
          draft.validation.url = validationErr;
          }))
      })
  }

  render() {
    return(
      <div>
       {renderValidationWarnings(this.state.validation)}
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
              onChange={(e) => {
                const input = e.target.value
                this.setState(produce(draft => {
                  draft.videoUrlInput = input;
                }));
              }}
              noValidate
            />
            <Button
              classNames='clickable'
              handleClick={this.handleUrlAdd}
              glyph='add'
            />
          </div>
        </div>
      </div>
    )
  }
}
