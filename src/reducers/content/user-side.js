import {
  FETCH_CONTENT_REQUEST,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_ERROR,
  OPEN_GALLERY,
  CLOSE_GALLERY
}
from '../../actions/content/multi-side';
import {
  SEARCH_BY_KEYWORD_RESULTS,
  SEARCH_BY_KEYWORD_NONE,
  SEARCH_BY_TAG_RESULTS,
  SEARCH_BY_TAG_NONE,

}
from '../../actions/content/user-side';

const initialState = {
  allContent: [],
  searchResults: [],
  searchResultsNone: null,
  galleryStarting: null,
  galleryFiles: [],
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  if (action.type === FETCH_CONTENT_REQUEST && action.meta === 'user') {
      return Object.assign({}, state, {
        loading: true,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_SUCCESS && action.meta === 'user') {
    //console.log('updating fetchContent in Redux State');
      return Object.assign({}, state, {
        allContent: [...action.content],
        loading: false,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_ERROR && action.meta === 'user') {
      return Object.assign({}, state, {
        error: action.error
     })
  } else if (action.type === SEARCH_BY_KEYWORD_RESULTS) {
      return Object.assign({}, state, {
        searchResults: [...action.results],
        searchResultsNone: null,
      })
  } else if (action.type === SEARCH_BY_KEYWORD_NONE) {
      return Object.assign({}, state, {
        searchResultsNone: "your query didn't match any results",
        searchResults: [],
      })
  } else if (action.type === SEARCH_BY_TAG_RESULTS) {
      return Object.assign({}, state, {
        searchResults: [...action.results],
        searchResultsNone: null,
      })
  } else if (action.type === SEARCH_BY_TAG_NONE) {
      return Object.assign({}, state, {
        searchResultsNone: "your query didn't match any results",
        searchResults: [],
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
