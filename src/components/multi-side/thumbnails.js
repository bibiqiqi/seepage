import React, {Fragment} from 'react';

import Thumbnail from './thumbnail';
import './thumbnails.css'

export default function Thumbnails(props) {

  const renderThumbnails = () => {
    const files = props.content.files;
    const thumbnails = files.map((e, i) => {
      return (
        <Thumbnail
          playing={props.playing}
          fileObject={files[i]}
          fileObjects={files}
          index={i}
          key={i}
          title={props.content.title}
          artistName={props.content.artistName}
          gallery={props.gallery}
        />
      )
    });
    return thumbnails
   }

  return(
    <Fragment>
      <div className='thumbnail-container'>
        {renderThumbnails()}
      </div>
    </Fragment>
  )
}
