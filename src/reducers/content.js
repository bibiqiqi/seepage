import {
    FILTER_CONTENT_SUCCESS,
    FILTER_CONTENT_NONE,
    FETCH_CONTENT_REQUEST,
    FETCH_CONTENT_SUCCESS,
    FETCH_CONTENT_ERROR,
    MAKE_SUGGESTED_ARTISTS,
    MAKE_SUGGESTED_TITLES,
    MAKE_SUGGESTED_TAGS
  }
from '../actions/content';

const initialState = {
    allContent: [],
    filteredContent: [],
    filteredContentNone: '',
    suggestedArtists: [],
    suggestedTitles: [],
    suggestedTags: [],
    loading: false,
    error: null,
};

export default function reducer(state = initialState, action) {
  if (action.type === FETCH_CONTENT_REQUEST) {
      return Object.assign({}, state, {
        loading: true,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_SUCCESS) {
      return Object.assign({}, state, {
        allContent: action.content,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_ERROR) {
      return Object.assign({}, state, {
        error: action.error
      })
  } else if (action.type === FILTER_CONTENT_SUCCESS) {
      return Object.assign({}, state, {
       filteredContent: action.filteredContent,
       filteredContentNone: null,
      })
  } else if (action.type === FILTER_CONTENT_NONE) {
      return Object.assign({}, state, {
       filteredContent: null,
       filteredContentNone: action.message,
      })
  } else if (action.type === MAKE_SUGGESTED_ARTISTS) {
      return Object.assign({}, state, {
        suggestedArtists: action.array
      })
  } else if (action.type === MAKE_SUGGESTED_TITLES) {
      return Object.assign({}, state, {
        suggestedTitles: action.array
      })
  } else if (action.type === MAKE_SUGGESTED_TAGS) {
      return Object.assign({}, state, {
        suggestedTags: action.array
      })
  }
  return state;
}
