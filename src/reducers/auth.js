import {
  SET_AUTH_TOKEN,
  CLEAR_AUTH,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_REQUEST
} from '../actions/auth';

const initialState = {
  authToken: null,
  currentEditor: null,
  loading: false,
  error: null
}

export default function authReducer(state = initialState, action) {
  if (action.type === SET_AUTH_TOKEN) {
      return Object.assign({}, state, {
        authToken: action.authToken
      });
  } else if (action.type === CLEAR_AUTH) {
      return Object.assign({}, state, {
        authToken: null,
        currentEditor: null
      });
  } else if (action.type === AUTH_REQUEST) {
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
  } else if (action.type === AUTH_SUCCESS) {
      return Object.assign({}, state, {
        loading: false,
        currentEditor: action.currentEditor
      });
  } else if (action.type === AUTH_ERROR) {
      return Object.assign({}, state, {
        loading: false,
        error: action.error
      })
  }
  return state;
}
