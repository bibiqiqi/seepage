import {fetchContentSuccess} from './multi-side'

export const FILTER_CONTENT_SUCCESS = 'FILTER_CONTENT_SUCCESS';
export const filterContentSuccess = filteredContent => ({
  type: FILTER_CONTENT_SUCCESS,
  filteredContent
});

export const FILTER_CONTENT_NONE = 'FILTER_CONTENT_NONE';
export const filterContentNone = () => ({
  type: FILTER_CONTENT_NONE,
});

export const MAKE_SUGGESTED_ARTISTS = 'MAKE_SUGGESTED_ARTISTS';
export const makeSuggestedArtists = suggestedArtists => ({
  type: MAKE_SUGGESTED_ARTISTS,
  suggestedArtists
});

export const MAKE_SUGGESTED_TITLES = 'MAKE_SUGGESTED_TITLES';
export const makeSuggestedTitles = suggestedTitles => ({
  type: MAKE_SUGGESTED_TITLES,
  suggestedTitles
});

export const MAKE_SUGGESTED_TAGS = 'MAKE_SUGGESTED_TAGS';
export const makeSuggestedTags = suggestedTags => ({
  type: MAKE_SUGGESTED_TAGS,
  suggestedTags
});

//called in find-form, for editor to filter content by search term
export const filterBySearch = (searchBy) => (dispatch, getState) => {
  //console.log('doing filterBySearch and heres the search object you sent', searchBy);
  const state = getState();
  const contents = state.editorContent.allContent;
  const noResults = "your query didn't match any results";
  let filteredResults = [];
  contents.forEach((e) => {
    if (e[searchBy.key].toLowerCase() === searchBy.value.toLowerCase()) {
      filteredResults.push(e);
    };
  })
  filteredResults[0]? dispatch(filterContentSuccess(filteredResults)) : dispatch(filterContentNone(noResults));
}

//called in find-form, for editor to filter content by browsing by category
export const filterByBrowse = (browseBy) => (dispatch, getState) => {
  //console.log('doing filterByBrowse and heres the browse object you sent', browseBy);
  const state = getState();
  const contents = state.editorContent.allContent;
  const results = [];
  let filteredResults = [];
  contents.forEach((e) => {
    browseBy.forEach((x) => {
      if (e.category.includes(x)) {
        results.push(e);
      }
    })
  })
  filteredResults = Array.from(new Set(results));
  filteredResults[0]? dispatch(filterContentSuccess(filteredResults)) : dispatch(filterContentNone());
}

//called by editContentInState, to map through current content in state and
//delete a document or insert a patched document
const findIndexAndSplice = (arrayOfData, contentId, editObject) => {
  //console.log('running findIndexAndSplice with', arrayOfData);
  return new Promise(function(resolve, reject) {
    const startingIndex = arrayOfData.findIndex((e) => {
      return e.id === contentId;
    });
    editObject ? arrayOfData.splice(startingIndex, 1, editObject) : arrayOfData.splice(startingIndex, 1) ;
    resolve(arrayOfData);
  })
}
//gets called after user makes an edit or a delete, to update the browser state
//if there's an editObject passed in, then the user made an edit, otherwise, they made a delete
export const editContentInState = (contentId, editObject) => (dispatch, getState) => {
  return new Promise(function(resolve, reject) {
   //console.log('running editContentInState()');
    const state = getState();
    const allContent = state.editorContent.allContent;
    const filteredContent = state.editorContent.filteredContent;
    findIndexAndSplice(allContent, contentId, editObject)
      .then(allContent => {
        dispatch(fetchContentSuccess(allContent));
        dispatch(makeSuggestedContent(allContent));
        findIndexAndSplice(filteredContent, contentId, editObject)
          .then(filteredContent => {
            dispatch(filterContentSuccess(filteredContent))
          })
     })
     resolve();
  })
};

//gets called after getContent on editor side, so autocomplete input field
//can suggest artistNames, titles, and tags, based on what's in database
export const makeSuggestedContent = (content) => (dispatch) => {
 //console.log('makeSuggestedContent is happening');
  let allArtists = [], allTitles = [], allTags = [];
  //consolidate all artists, tags, and titles into an array
  content.forEach(function(e) {
    allArtists.push(e.artistName);
    allTitles.push(e.title);
    e.tags.forEach(function(x) {
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
