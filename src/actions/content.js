import {SubmissionError} from 'redux-form';

import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FILTER_CONTENT_SUCCESS = 'FILTER_CONTENT_SUCCESS';
export const filterContentSuccess = filteredContent => ({
  type: FILTER_CONTENT_SUCCESS,
  filteredContent
});

export const FILTER_CONTENT_NONE = 'FILTER_CONTENT_NONE';
export const filterContentNone = message => ({
  type: FILTER_CONTENT_NONE,
  message
});

export const FETCH_CONTENT_REQUEST = 'FETCH_CONTENT';
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

export const MAKE_SUGGESTED_ARTISTS = 'MAKE_SUGGESTED_ARTISTS';
export const makeSuggestedArtists = array => ({
  type: MAKE_SUGGESTED_ARTISTS,
  array
});

export const MAKE_SUGGESTED_TITLES = 'MAKE_SUGGESTED_TITLES';
export const makeSuggestedTitles = array => ({
  type: MAKE_SUGGESTED_TITLES,
  array
});

export const MAKE_SUGGESTED_TAGS = 'MAKE_SUGGESTED_TAGS';
export const makeSuggestedTags = array => ({
  type: MAKE_SUGGESTED_TAGS,
  array
});

export const fetchContent = (rootRequest) => (dispatch) => {
  console.log("doing fetchContent");
  dispatch(fetchContentRequest());
  return fetch(`${API_BASE_URL}/content`)
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then(data => dispatch(fetchContentSuccess(data)))
    .then((content) => {
      if(rootRequest === 'editor') {
       dispatch(makeSuggestedContent(content));
      }
    })
    .catch(err => {
      dispatch(fetchContentError(err));
      return Promise.reject(
        new SubmissionError({
          _error: err
        })
      );
    })
};

export const filterContent = (filterObject) => (dispatch, getState) => {
  console.log(filterObject);
  const state = getState();
  const contents = state.content.allContent.contents;
  const noResults = "your query didn't match any results";
  let filteredResults = [];
  if ('browseBy' in filterObject) {
    const {browseBy} = filterObject;
    contents.forEach((e) => {
      browseBy.forEach((x) => {
        if (e.category === x) {
          filteredResults.push(e);
        }
      })
    })
  } else {
    const {searchBy} = filterObject;
    const query = filterObject[searchBy].toLowerCase();
     contents.forEach((e) => {
        if (e[searchBy].toLowerCase() === query){
          filteredResults.push(e);
        };
     })
  };
  filteredResults[0]? dispatch(filterContentSuccess(filteredResults)) : dispatch(filterContentNone(noResults));
};

export const makeSuggestedContent = (content) => (dispatch) => {
  console.log('makeSuggestedContent is happening');
  const contents = content.content.contents;
  let allArtists = [], allTitles = [], allTags = [];
  //consolidate all artists, tags, and titles into an array
  contents.map((e) => {
    allArtists.push(e.artistName);
    allTitles.push(e.title);
    e.tags.map((x) => {
      allTags.push(x);
    })
  });
  //console.log('allArtists is', allArtists);
  //console.log('allTitles is', allTitles);
  //console.log('allTags is', allTags);
  //filtering out all the duplicates in the array
  const suggestedTitles = [...new Set(allTitles)];
  //console.log('suggestedTitles is', suggestedTitles);
  dispatch(makeSuggestedTitles(suggestedTitles));
  const suggestedTags = [...new Set(allTags)];
  //console.log('suggestedTags is', suggestedTags);
  dispatch(makeSuggestedTags(suggestedTags));
  const suggestedArtists = [...new Set(allArtists)];
  //console.log('suggestedArtists is', suggestedArtists);
  dispatch(makeSuggestedArtists(suggestedArtists));
}
