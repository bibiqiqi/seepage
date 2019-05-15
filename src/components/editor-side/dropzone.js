import Dropzone from 'react-dropzone';
import React from 'react';

// const renderDropzoneField = function ({ input, name, id, meta: { dirty, error } }) {
//   return (
//     <div>
//       <Dropzone
//         name={name}
//         onDrop={filesToUpload => input.onChange(filesToUpload)}
//       >
//         Import image to upload
//       </Dropzone>
//       {dirty &&
//         (error && <span>{error}</span>)
//       }
//     </div>
//   );
// }

export default class RenderDropZone extends React.Component {
  render() {
    const files = this.props.files.map(file => (
      <li key={file.name}>
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

// export default function RenderDropZone(field) {
//   const files = field.input.value;
//   return (
//     <div>
//       <Dropzone
//         name={field.name}
//         onDrop={( filesToUpload, e ) => field.input.onChange(filesToUpload)}
//       >
//         <div>Try dropping some files here, or click to select files to upload.</div>
//       </Dropzone>
//       {field.meta.touched &&
//         field.meta.error &&
//         <span className="error">{field.meta.error}</span>}
//       {files && Array.isArray(files) && (
//         <ul>
//           { files.map((file, i) => <li key={i}>{file.name}</li>) }
//         </ul>
//       )}
//     </div>
//   )
// }
