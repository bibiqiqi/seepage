import React from 'react';
import {connect} from 'react-redux';
import ReactPlayer from 'react-player'

import TextIcon from '../../text-icon.jpg'
import {API_BASE_URL} from '../../config';
import {fetchFileIds, clearFileIds} from '../../actions/content/multi-side';

class ContentPreview extends React.Component {
  //renders a gallery viewer component for user to view the files of a content entry, one at a time
  //makes a GET request to stream a single file at a time

  componentDidMount(){
    if(this.props.node.type === 'secondary') {
      console.log('dispatching fetchFileIds');
      this.props.dispatch(fetchFileIds(this.props.node.id, "user"));
    }
  }

  componentWillUnmount(){
    this.props.dispatch(clearFileIds("user"));
  }

  renderThumbNailState() {
    if(this.props.node.type === 'secondary') {
      //debugger;
      if (this.props.loading) {
        console.log('returning loading')
        return <g><text x='1em' y='4em'>...</text></g>
      } else if (this.props.error) {
        console.log('returning error')
        return <g><text x='1em' y='4em'>there was an issue with fetching the files</text></g>
      } else if (!this.props.loading && !this.props.error && this.props.fileObjects.length) {
        console.log('returning thumbNails')
        //if the redux state of fileIds is populated, then generate html from them
        //debugger;
        const thumbNails = this.props.fileObjects.map((e, i) => {
          let x = 0;
          let thumbNail;
          const url = `${API_BASE_URL}/content/files/${e.fileId}`;
          if(e.type.includes('image')) {
            thumbNail =
            <image
              x={`${x}em`} y='2em'
              href={url}
              width='100'
              height='100'
              id={`thumbnail_${i}`}
              alt={`thumbnail ${i} for ${this.props.node.title}, by ${this.props.node.artist}`}
            />;
          } else if (e.type.includes('video')) {
            thumbNail =
            <foreignObject
              x={`${x}em`} y='2em'
              width='100'
              height='100'
              id={`thumbnail_${i}`}
              alt={`thumbnail ${i} for ${this.props.node.title}, by ${this.props.node.artist}`}
            >
              <ReactPlayer
                url={url}
                playing
                muted
                width='100%'
                height='100%'
              />
            </foreignObject>
          } else if (e.type.includes('pdf')) {
            thumbNail =
            <image
              x={`${x}em`} y='2em'
              href={TextIcon}
              width='100'
              height='100'
              id={`thumbnail_${i}`}
              alt={`thumbnail ${i} for ${this.props.node.title}, by ${this.props.node.artist}`}
            />;
          }
          console.log('returning', thumbNail);
          x++;
          return (
            <g class='preview'>
             {thumbNail}
           </g>
          )
        });
        console.log('returning', thumbNails);
        //debugger;
        return thumbNails
      }
    } else {
      return null
    }
  }

  render(){
    //debugger;

    let text;
    if(this.props.node.type === "primary"){
      text =
        <text x='1em' y='1em'>{this.props.node.tag}</text>
    } else {
      console.log('showing preview for', this.props.node.title, 'by', this.props.node.artistName)
      text =
      <g>
        <text x='1em' y='1em'>{this.props.node.title}</text>
        <text x='1em' y='2em'>by</text>
        <text x='1em' y='3em'>{this.props.node.artistName}</text>
      </g>
    };
    return(
      <svg
        class={`nodePreview nodePreview-${this.props.node.index}`}
      >
        {text}
        {this.renderThumbNailState()}
      </svg>
    );
  }

}

const mapStateToProps = state => ({
  fileObjects: state.userContent.fileIds,
  loading: state.userContent.loading,
  error: state.userContent.error
});

export default connect(mapStateToProps)(ContentPreview);
