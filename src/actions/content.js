import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';
import {SubmissionError} from 'redux-form';

export const FILTER_CONTENT_SUCCESS = 'FILTER_CONTENT';
export const filterContentSuccess = filterObject => ({
  type: FILTER_CONTENT_SUCCESS,
  filterObject
});

export const FETCH_CONTENT_REQUEST = 'GET_CONTENT';
export const fetchContentRequest = () => ({
  type: FETCH_CONTENT_REQUEST,
});

export const FETCH_CONTENT_SUCCESS = 'FETCH_CONTENT_SUCCESS';
export const fetchContentSuccess = content => ({
  type: FETCH_CONTENT_SUCCESS,
  content
});

export const FETCH_CONTENT_ERROR = 'FETCH_CONTENT_ERROR';
export const fetchContentError = error => ({
  type: FETCH_CONTENT_ERROR,
  error
});

export const fetchContent = () => (dispatch) => {
  console.log("doing fetchContent");
  dispatch(fetchContentRequest());
  return fetch(`${API_BASE_URL}/content`)
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then((data) => dispatch(fetchContentSuccess(data)))
    .catch(err => {
      const {code} = err;
      const message =
        code === 401
          ? 'Incorrect username or password'
          : 'Unable to login, please try again';
      dispatch(fetchContentError(err));
      return Promise.reject(
        new SubmissionError({
          _error: message
        })
      );
    })
};
