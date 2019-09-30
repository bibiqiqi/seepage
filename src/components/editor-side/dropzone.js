import Dropzone from 'react-dropzone';
import React from 'react';

export default class RenderDropZone extends React.Component {
  render() {
    const files = this.props.files.map((file, i) => (
      <li id={file.name} key={i}>
        {file.name} - {file.size} bytes
      </li>
    ));

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
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}
