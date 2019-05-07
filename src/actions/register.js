import {SubmissionError} from 'redux-form';

import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const registerEditor = editor => dispatch => {
  return fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(editor)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .catch(err => {
      const {reason, message, location} = err;
      if (reason === 'ValidationError') {
        // convert ValidationErrors into Submission Errors for Redux Form
        return Promise.reject(
          new SubmissionError({
            [location]: message
          })
        )
      }
    })
}
