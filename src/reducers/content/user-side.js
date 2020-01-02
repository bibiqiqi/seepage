import {
  FETCH_CONTENT_REQUEST,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_ERROR,
}
from '../../actions/content/multi-side';
import {
  SEARCH_BY_KEYWORD_RESULTS,
  SEARCH_BY_KEYWORD_NONE
}
from '../../actions/content/user-side';

const initialState = {
  allContent: [],
  searchByKeyWordResults: [],  //array of contents with associated fileIds
  searchByKeyWordResultsNone: null,
  browseByMap: null, //object of 1 content result that user chose with associated fileIds
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
    console.log('updating fetchContent in Redux State');
      return Object.assign({}, state, {
        allContent: action.content,
        loading: false,
        error: null
      })
  } else if (action.type === FETCH_CONTENT_ERROR && action.meta === 'user') {
      return Object.assign({}, state, {
        error: action.error
     })
  } else if (action.type === SEARCH_BY_KEYWORD_RESULTS) {
      return Object.assign({}, state, {
        searchByKeyWordResults: action.results,
        searchByKeyWordResultsNone: null,
      })
  } else if (action.type === SEARCH_BY_KEYWORD_NONE) {
      return Object.assign({}, state, {
        searchByKeyWordResultsNone: "your query didn't match any results"
      })
  }
  return state;
}
