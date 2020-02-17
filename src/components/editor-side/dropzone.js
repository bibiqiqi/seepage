import Dropzone from 'react-dropzone';
import React from 'react';
import './dropzone.css';

export default class RenderDropZone extends React.Component {
  render() {
    return (
      <Dropzone
        onDrop={this.props.onDrop}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps({className: 'dropzone'})}>
            <label>
              <i class="material-icons">attach_file</i>
              <input {...getInputProps()}/>
            </label>
          </div>
        )}
      </Dropzone>
    );
  }
}
