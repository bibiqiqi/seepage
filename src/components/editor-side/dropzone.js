import Dropzone from 'react-dropzone';
import React from 'react';

export default class RenderDropZone extends React.Component {
  render() {

    return (
      <Dropzone
        onDrop={this.props.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
              <h4>Files</h4>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}
