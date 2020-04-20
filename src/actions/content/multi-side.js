import {SubmissionError} from 'redux-form';

import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../utils';
import {makeSuggestedContent} from './editor-side';

export const FETCH_CONTENT_REQUEST = 'FETCH_CONTENT_REQUEST';
export const fetchContentRequest = (root) => ({
  type: FETCH_CONTENT_REQUEST,
  meta: root
});

export const FETCH_CONTENT_SUCCESS = 'FETCH_CONTENT_SUCCESS';
export const fetchContentSuccess = (content, root) => ({
  type: FETCH_CONTENT_SUCCESS,
  meta: root,
  content
});

export const FETCH_CONTENT_ERROR = 'FETCH_CONTENT_ERROR';
export const fetchContentError = (error, root) => ({
  type: FETCH_CONTENT_ERROR,
  meta: root,
  error
});

export const OPEN_GALLERY = 'OPEN_GALLERY';
export const openGallery = (files, startingIndex) => ({
  type: OPEN_GALLERY,
  files,
  startingIndex
});

export const CLOSE_GALLERY = 'CLOSE_GALLERY';
export const closeGallery = () => ({
  type: CLOSE_GALLERY
});

//called on editor and user side to return all documents in mongo (not files in GridFS)
export const fetchContent = (rootOfRequest) => (dispatch) => {
  return new Promise(function(resolve, reject) {
    dispatch(fetchContentRequest(rootOfRequest));
    return fetch(`${API_BASE_URL}/content`)
      .then(res => normalizeResponseErrors(res))
      .then(res => res.clone().json())
      .then(data => dispatch(fetchContentSuccess(data, rootOfRequest)))
      .then(content => {
        const contents = content.content;
        if(rootOfRequest === 'editor') {
         dispatch(makeSuggestedContent(contents));
       }
        resolve(content);
      })
      .catch(err => {
        dispatch(fetchContentError(err, rootOfRequest));
        return Promise.reject(
          new SubmissionError({
            _error: err
          })
        );
      })
    }
  )
};

export const openGalleryRequest = (filesArray, index) => (dispatch) => {
//console.log('you called openGalleryRequest');
  const startingIndex = index? index : 0;
  dispatch(openGallery(filesArray, startingIndex));
}
