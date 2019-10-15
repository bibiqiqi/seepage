import {SubmissionError} from 'redux-form';

import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FETCH_CONTENT_REQUEST = 'FETCH_CONTENT_REQUEST';
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

export const FETCH_THUMBNAILS_REQUEST = 'FETCH_THUMBNAILS_REQUEST';
export const fetchThumbNailsRequest = () => ({
  type: FETCH_THUMBNAILS_REQUEST,
});

export const FETCH_THUMBNAILS_SUCCESS = 'FETCH_THUMBNAILS_SUCCESS';
export const fetchThumbNailsSuccess = thumbNails => ({
  type: FETCH_THUMBNAILS_SUCCESS,
  thumbNails
});

export const FETCH_THUMBNAILS_ERROR = 'FETCH_THUMBNAILS_ERROR';
export const fetchThumbNailsError = error => ({
  type: FETCH_THUMBNAILS_ERROR,
  error
});

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

export const EDIT_FILTERED_CONTENT_SUCCESS = 'EDIT_FILTERED_CONTENT_SUCCESS';
export const editFilteredContentSuccess = editedFilteredContent => ({
  type: EDIT_FILTERED_CONTENT_SUCCESS,
  editedFilteredContent
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
    .then(content => {
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

function arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
  };

export const fetchThumbNails = (contentId) => (dispatch) => {
  console.log("doing fetchThumbnails");
  dispatch(fetchThumbNailsRequest());
  return fetch(`${API_BASE_URL}/content/thumbnails/${contentId}`)
    .then(res => normalizeResponseErrors(res))
    .then(res => res.clone().json())
    .then(data => {
      //debugger;
      const base64Flag = 'data:image/jpeg;base64, ';
      const thumbNails = data.thumbNails.map((e) => {
        const thumbNail = {};
        thumbNail.id = e._id;
        const imageStr = arrayBufferToBase64(e.data.data);
        thumbNail.src = base64Flag + imageStr;
        return thumbNail
     });
     dispatch(fetchThumbNailsSuccess(thumbNails));
    })
    .catch(err => {
      dispatch(fetchThumbNailsError(err));
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
  const contents = state.content.allContent;
  const noResults = "your query didn't match any results";
  let filteredResults = [];
  if ('browseBy' in filterObject) {
    const results = [];
    const {browseBy} = filterObject;
    contents.forEach((e) => {
      browseBy.forEach((x) => {
        if (e.category.includes(x)) {
          results.push(e);
        }
      })
    })
    filteredResults = Array.from(new Set(results));
  } else {
    const {searchBy} = filterObject;
    const parameter = Object.keys(searchBy)[0];
    const query = searchBy[Object.keys(searchBy)[0]].toLowerCase();
     contents.forEach((e) => {
        if (e[parameter].toLowerCase() === query){
          filteredResults.push(e);
        };
     })
  };
  //debugger;
  filteredResults[0]? dispatch(filterContentSuccess(filteredResults)) : dispatch(filterContentNone(noResults));
};

export const editFilteredContent = (contentId, editObject) => (dispatch, getState) => {
  console.log('running editFilteredContent to delete the following content from filteredContent state', contentId);
  const state = getState();
  const filteredContent = state.content.filteredContent;
  const deletionIndex = filteredContent.findIndex((e) => {
    return e.contentId = contentId;
  });
  filteredContent.splice(deletionIndex, 1);
  dispatch(editFilteredContentSuccess(filteredContent));
};

export const makeSuggestedContent = (content) => (dispatch) => {
  console.log('makeSuggestedContent is happening');
  //debugger;
  const contents = content.content;
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
  const suggestedTitles = Array.from([...new Set(allTitles)]);
  //console.log('suggestedTitles is', suggestedTitles);
  dispatch(makeSuggestedTitles(suggestedTitles));
  const suggestedTags = Array.from([...new Set(allTags)]);
  //console.log('suggestedTags is', suggestedTags);
  dispatch(makeSuggestedTags(suggestedTags));
  const suggestedArtists = Array.from([...new Set(allArtists)]);
  //console.log('suggestedArtists is', suggestedArtists);
  dispatch(makeSuggestedArtists(suggestedArtists));
}
