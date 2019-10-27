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
  //console.log("doing fetchContent");
  //debugger;
  return new Promise(function(resolve, reject) {
    dispatch(fetchContentRequest());
    return fetch(`${API_BASE_URL}/content`)
      .then(res => normalizeResponseErrors(res))
      .then(res => res.clone().json())
      .then(data => dispatch(fetchContentSuccess(data)))
      .then(content => {
        if(rootRequest === 'editor') {
         const contents = content.content;
         dispatch(makeSuggestedContent(contents));
        }
        resolve(content);
      })
      .catch(err => {
        dispatch(fetchContentError(err));
        return Promise.reject(
          new SubmissionError({
            _error: err
          })
        );
      })
    }
  )
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

export const filterContent = (filterObject, updatedContent) => (dispatch, getState) => {
  console.log('doing filterContent and heres the filterObject you sent', filterObject);
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
  filteredResults[0]? dispatch(filterContentSuccess(filteredResults)) : dispatch(filterContentNone(noResults));
};

const findIndexAndSplice = (arrayOfData, contentId, editObject) => {
  console.log('running findIndexAndSplice with', arrayOfData);
  return new Promise(function(resolve, reject) {
    const startingIndex = arrayOfData.findIndex((e) => {
      return e.contentId = contentId;
    });
    editObject ? arrayOfData.splice(startingIndex, 1, editObject) : arrayOfData.splice(startingIndex, 1) ;
    resolve(arrayOfData);
  })
}
//gets called after user makes an edit or a delete.
//if there's an editObject passed in, then the user made an edit, otherwise, they made a delete
export const editContentInState = (contentId, editObject) => (dispatch, getState) => {
  //debugger;
  return new Promise(function(resolve, reject) {
    console.log('running editContentInState()');
    const state = getState();
    const allContent = state.content.allContent;
    const filteredContent = state.content.filteredContent;
    findIndexAndSplice(allContent, contentId, editObject)
      .then(allContent => {
        dispatch(fetchContentSuccess(allContent));
        dispatch(makeSuggestedContent(allContent));
        findIndexAndSplice(filteredContent, contentId, editObject)
          .then(filteredContent => {
            dispatch(filterContentSuccess(filteredContent))
          })
     })
     resolve(console.log('edited Content in State!'));
  })
};

export const makeSuggestedContent = (content) => (dispatch) => {
  console.log('makeSuggestedContent is happening');
  //debugger;
  let allArtists = [], allTitles = [], allTags = [];
  //consolidate all artists, tags, and titles into an array
  content.map((e) => {
    allArtists.push(e.artistName);
    allTitles.push(e.title);
    e.tags.map((x) => {
      allTags.push(x);
    })
  });
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
