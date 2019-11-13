import React, {Fragment} from 'react';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import {toast} from 'react-toastify';

import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';

export default class EditorGallery extends React.Component {
  //renders a gallery viewer component for user to view the files of a content entry, one at a time
  //makes a GET request to stream a single file at a time
  constructor(props) {
    super(props);
    this.state = {
      asyncCall: {
        loading: false,
        error: false,
        currentFileUrl: '',
      },
      currentArtIndex: null
    }
    this.fetchFile = this.fetchFile.bind(this);
    this.handleArrowClick = this.handleArrowClick.bind(this);
  }

  componentDidMount(){
    const currentArtIndex = this.props.firstArtIndex;
    this.setState({currentArtIndex});
    this.fetchFile(this.props.thumbNailIds[currentArtIndex]);
  }

  fetchFile(thumbNailId) {
    const asyncCall = cloneDeep(this.state.asyncCall);
    if(asyncCall.currentFileUrl) {
      URL.revokeObjectURL(asyncCall.currentFileUrl);
    }
    asyncCall.currentFileUrl = '';
    asyncCall.loading = true;
    this.setState({asyncCall});
    return fetch(`${API_BASE_URL}/content/files/${thumbNailId}`)
      .then(res => normalizeResponseErrors(res))
      .then(res => res.blob())
      .then(blob => {
        asyncCall.loading = false;
        asyncCall.currentFileUrl = URL.createObjectURL(blob);
        this.setState({asyncCall});
      })
      .catch(err => {
        asyncCall.loading = false;
        asyncCall.error = err;
        this.setState({asyncCall});
      })
  };

  handleArrowClick(direction) {
    //increments or decrements the currentArtIndex, updates the state, and makes GET request for current file
    const thumbNailIds = this.props.thumbNailIds;
    const highestIndex = thumbNailIds.length-1
    let oldArtIndex = parseInt(this.state.currentArtIndex, 10);
    let currentArtIndex;
    if(direction === 'back') {
      //if the oldArtIndex is NOT zero, decrement it,
      //otherwise the index number is looping around to the end of array
      currentArtIndex = oldArtIndex? --oldArtIndex : highestIndex;
    } else { //direction === 'forward'
      //if the oldArtIndex is less than the highestIndex, increment it,
      //otherwise the index number is looping around to the front of the array;
      currentArtIndex = (oldArtIndex < highestIndex)? ++oldArtIndex : 0;
    }
    this.setState({currentArtIndex});
    this.fetchFile(thumbNailIds[currentArtIndex])
  }

  renderFileState() {
    //renders file state based on the status of the async GET request for file
    if (this.state.asyncCall.loading){
      return toast('loading');
    } else if (this.state.asyncCall.error) {
      toast.dismiss();
      return toast.error('sorry, there was an error retrieving the file');
    } else {
      toast.dismiss();
      return (
        <Fragment>
          <span
            className = {classnames('exit', 'exit-gallery')}
            onClick = {() => this.props.onExitClick()}
          >T
          </span>
          <span
            className={classnames('slider-back', 'arrow')}
            onClick={() => this.handleArrowClick('back')}
          >E
          </span>
          <span
            className={classnames('slider-forward', 'arrow')}
            onClick={() => this.handleArrowClick('forward')}
          >F
          </span>
          <img
          className= 'art'
          src={this.state.asyncCall.currentFileUrl}
          alt={this.props.alt}
          />
        </Fragment>
      )
    }
  }

  render(){
    return (
      <div
        className='gallery'
      >
        {this.renderFileState()}
      </div>
    )
  }
}
