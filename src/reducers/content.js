import {
    FILTER_CONTENT_SUCCESS,
    FILTER_CONTENT_NONE,
    FETCH_CONTENT_REQUEST,
    FETCH_CONTENT_SUCCESS,
    FETCH_CONTENT_ERROR,
    FETCH_THUMBNAILS_REQUEST,
    FETCH_THUMBNAILS_SUCCESS,
    FETCH_THUMBNAILS_ERROR,
    MAKE_SUGGESTED_ARTISTS,
    MAKE_SUGGESTED_TITLES,
    MAKE_SUGGESTED_TAGS
  }
from '../actions/content';

const initialState = {
    allContent: [],
    thumbNails: [],
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
    console.log('updating fetchContent in Redux State');
      return Object.assign({}, state, {
        allContent: action.content,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_ERROR) {
      return Object.assign({}, state, {
        error: action.error
     })
  } else if (action.type === FETCH_THUMBNAILS_REQUEST) {
      return Object.assign({}, state, {
        loading: true,
        error: null
      })
  } else if (action.type === FETCH_THUMBNAILS_SUCCESS) {
      return Object.assign({}, state, {
        thumbNails: action.thumbNails,
        error: null
      })
  } else if (action.type === FETCH_THUMBNAILS_ERROR) {
      return Object.assign({}, state, {
        error: action.error
      })
  } else if (action.type === FILTER_CONTENT_SUCCESS) {
    console.log('updating filteredContent in Redux State');
      return Object.assign({}, state, {
       filteredContent: action.filteredContent,
       filteredContentNone: null,
      })
  } else if (action.type === FILTER_CONTENT_NONE) {
      return Object.assign({}, state, {
       filteredContentNone: action.message,
      })
  } else if (action.type === MAKE_SUGGESTED_ARTISTS) {
    console.log('updating suggestedArtists in Redux State');
      return Object.assign({}, state, {
        suggestedArtists: action.array
      })
  } else if (action.type === MAKE_SUGGESTED_TITLES) {
    console.log('updating suggestedTitles in Redux State');
      return Object.assign({}, state, {
        suggestedTitles: action.array
      })
  } else if (action.type === MAKE_SUGGESTED_TAGS) {
    console.log('updating suggestedTags in Redux State');
      return Object.assign({}, state, {
        suggestedTags: action.array
      })
  }
  return state;
}
