import {
  FETCH_CONTENT_REQUEST,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_ERROR,
  OPEN_GALLERY,
  CLOSE_GALLERY
}
from '../../actions/content/multi-side';

import {
  FILTER_CONTENT_SUCCESS,
  FILTER_CONTENT_NONE,
  MAKE_SUGGESTED_ARTISTS,
  MAKE_SUGGESTED_TITLES,
  MAKE_SUGGESTED_TAGS
}
from '../../actions/content/editor-side';

const initialState = {
  allContent: [],
  filteredContent: [],
  filteredContentNone: null,
  suggestedArtists: [],
  suggestedTitles: [],
  suggestedTags: [],
  galleryStarting: null,
  galleryFiles: [],
  loading: false,
  error: null,
};

export default function reducer(state = initialState, action) {
  if (action.type === FETCH_CONTENT_REQUEST && action.meta === 'editor') {
      return Object.assign({}, state, {
        loading: true,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_SUCCESS && action.meta === 'editor') {
    //console.log('updating fetchContent in Redux State');
      return Object.assign({}, state, {
        allContent: [...action.content],
        loading: false,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_ERROR && action.meta === 'editor') {
      return Object.assign({}, state, {
        error: action.error
     })
  } else if (action.type === FILTER_CONTENT_SUCCESS) {
    //console.log('updating filteredContent in Redux State');
      return Object.assign({}, state, {
       filteredContent: [...action.filteredContent],
       filteredContentNone: null,
      })
  } else if (action.type === FILTER_CONTENT_NONE) {
      return Object.assign({}, state, {
       filteredContentNone: "your query didn't match any results"
      })
  } else if (action.type === MAKE_SUGGESTED_ARTISTS) {
    //console.log('updating suggestedArtists in Redux State');
      return Object.assign({}, state, {
        suggestedArtists: [...action.suggestedArtists]
      })
  } else if (action.type === MAKE_SUGGESTED_TITLES) {
    //console.log('updating suggestedTitles in Redux State');
      return Object.assign({}, state, {
        suggestedTitles: [...action.suggestedTitles]
      })
  } else if (action.type === MAKE_SUGGESTED_TAGS) {
    //console.log('updating suggestedTags in Redux State');
      return Object.assign({}, state, {
        suggestedTags: [...action.suggestedTags]
      })

  } else if (action.type === OPEN_GALLERY) {
      return Object.assign({}, state, {
        galleryFiles: [...action.files],
        galleryStarting: action.startingIndex
      })
  } else if (action.type === CLOSE_GALLERY) {
      return Object.assign({}, state, {
        galleryFiles: [],
        galleryStarting: null
      })
  }
  return state;
}
