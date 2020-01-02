import React, {Fragment} from 'react';
import VideoThumbnail from 'react-video-thumbnail';

import {API_BASE_URL} from '../../config';
import PlayIcon from '../../play-icon.png'
import TextIcon from '../../text-icon.jpg'

export default function Thumbnail(props) {
  //if there's a src key in the fileObject, then Thumbnail component is being used to display an upload preview for an image
  //not in the db yet, otherwise, it's for an image that's in the db
  const url = props.fileObject.src? props.fileObject.src : `${API_BASE_URL}/content/files/${props.fileObject.fileId}`;
  let thumbnail;
  if(props.fileObject.fileType.includes('image')) {
    thumbnail =
       <img src={url} alt={`thumbnail ${props.index}`}></img>
  } else if (props.fileObject.fileType.includes('video')) {
    thumbnail =
      <Fragment>
        <img
          src={PlayIcon}
          className='play-icon'
          alt=''
        ></img>
        <VideoThumbnail
          videoUrl={url}
          width={100}
          className='video-thumbnail'
        />
      </Fragment>
  } else if (props.fileObject.fileType.includes('pdf')) {
    thumbnail =
    <img src={TextIcon} alt={`thumbnail ${props.index}`}></img>
  };
  return (
    <div
      className='thumbnail'
      key={props.index}
      id={`thumbnail_${props.index}`}
      alt={`thumbNail ${props.index} for ${props.title}, by ${props.artistName}`}
      onClick={(e) => {if(props.gallery) {this.handleGalleryOpen(e)}}}
    >
      {thumbnail}
    </div>
  )
}
