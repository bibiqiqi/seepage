import React, {Fragment} from "react";
import Thumbnail from './thumbnail';
import {Button} from '../multi-side/clickables';
import './thumbnails.css'
import * as classnames from 'classnames';

export default class Thumbnails extends React.Component {

  handleRemoveClick(e){
    //selected to remove a file in the current edit form
    const index = parseFloat(e.currentTarget.className.slice(10));
    console.log('handleRemoveClick() in Thumbnails is calling handleRemoveClick in file-url-input and passing this index', index)
    this.props.handleRemoveClick(index);
  }

  renderThumbnailsFromUpload(){
    if(this.props.thumbnailUrls){
      // console.log(this.props.thumbnailUrls)
      const thumbnails = this.props.thumbnailUrls.map((e, i) => {
        return (
          <div
            className ='upload-tn'
            key={i}
          >
            <Button
              index={i}
              handleClick={e => this.handleRemoveClick(e)}
              className={classnames(`upload-tn-${i}`)}
              glyph='close'
            />
            <Thumbnail
              fileObject={e}
              index={i}
              gallery={this.props.gallery}
              autoplay={this.props.autoplay}
            />
          </div>
        )
      });
      return (
        <div className='upload-tn-container'>
          {thumbnails}
        </div>
    )
  } else {
      return null
    }
  }

  renderThumbnailsFromDb() {   //rendering thumbnails from the DB
    const files = this.props.content.files;
    const thumbnails = files.map((e, i) => {
      return (
        <Thumbnail
          fileObject={files[i]}
          fileObjects={files}
          index={i}
          key={i}
          gallery={this.props.gallery}
          autoplay={this.props.autoplay}
        />
      )
    });
    return thumbnails
   }

  render() {
    return(
      <Fragment>
        <div className='thumbnail-container'>
          {this.props.thumbnailUrls? this.renderThumbnailsFromUpload() : this.renderThumbnailsFromDb()}
        </div>
      </Fragment>
    )
  }
}
