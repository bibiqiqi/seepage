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

export const FETCH_FILE_IDS_REQUEST = 'FETCH_FILE_IDS_REQUEST';
export const fetchFileIdsRequest = (root) => ({
  type: FETCH_FILE_IDS_REQUEST,
});

export const FETCH_FILE_IDS_SUCCESS = 'FETCH_FILE_IDS_SUCCESS';
export const fetchFileIdsSuccess = (fileIds, root) => ({
  type: FETCH_FILE_IDS_SUCCESS,
  meta: root,
  fileIds
});

export const FETCH_FILE_IDS_ERROR = 'FETCH_FILE_IDS_ERROR';
export const fetchFileIdsError = (error, root) => ({
  type: FETCH_FILE_IDS_ERROR,
  meta: root,
  error
});

export const CLEAR_FILE_IDS = 'CLEAR_FILE_IDS';
export const clearFileIds = (root) => ({
  type: CLEAR_FILE_IDS,
  meta: root,
});

export const fetchContent = (rootOfRequest) => (dispatch) => {
  //console.log("doing fetchContent");
  //debugger;
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

export const arrayBufferToBase64 = (buffer) => {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
  };

export const fetchFileIds = (contentId, rootOfRequest) => (dispatch) => {
  console.log("doing fetchfileIds");
  dispatch(fetchFileIdsRequest(rootOfRequest));
  return fetch(`${API_BASE_URL}/content/fileIds/${contentId}`)
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then(fileIds => {
     dispatch(fetchFileIdsSuccess(fileIds, rootOfRequest))
     console.log("did fetchfileIds");
    })
    .catch(err => {
      dispatch(fetchFileIdsError(err, rootOfRequest));
      return Promise.reject(
        new SubmissionError({
          _error: err
        })
      );
    })
};
