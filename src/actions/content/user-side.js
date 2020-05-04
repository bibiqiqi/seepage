export const SEARCH_BY_KEYWORD_RESULTS = 'SEARCH_BY_KEYWORD_RESULTS';
export const searchByKeyWordResults = results => ({
  type: SEARCH_BY_KEYWORD_RESULTS,
  results
});

export const SEARCH_BY_KEYWORD_NONE = 'SEARCH_BY_KEYWORD_NONE';
export const searchByKeyWordNone = () => ({
  type: SEARCH_BY_KEYWORD_NONE,
});

export const SEARCH_BY_TAG_RESULTS = 'SEARCH_BY_TAG_RESULTS';
export const searchByTagResults = results => ({
  type: SEARCH_BY_TAG_RESULTS,
  results
});

export const SEARCH_BY_TAG_NONE = 'SEARCH_BY_TAG_NONE';
export const searchByTagNone = () => ({
  type: SEARCH_BY_TAG_NONE,
});

export const searchByKeyWord = (keyWord) => (dispatch, getState) => {
  return new Promise(function(resolve, reject) {
    //console.log('doing searchByKeyWord and heres the term you sent', keyWord);
    const state = getState();
    const contents = state.userContent.allContent;
    let filteredResults = [];
    const lowerCaseKw = keyWord.toLowerCase();
    contents.forEach((e) => {
      if (
           (e.artistName.toLowerCase().includes(lowerCaseKw)) ||
           (e.title.toLowerCase().includes(lowerCaseKw)) ||
           (e.tags.join(' ').toLowerCase().includes(lowerCaseKw))
         ) {
             filteredResults.push(e);
       };
    })
      let objectId; //placeholder for the id from the previous element
      filteredResults.forEach(function (e, i){
        if(i === 0) {
          objectId = e.id;
        } else {
          if(objectId === e.id) {
            filteredResults.splice(i, 1);
          } else {
            objectId = e.id;
          }
        }
      })
      //console.log('filteredResults are:', filteredResults);
      filteredResults[0]? dispatch(searchByKeyWordResults(filteredResults)) : dispatch(searchByKeyWordNone());
  })
}

export const searchByTag = (tag) => (dispatch, getState) => {
  return new Promise(function(resolve, reject) {
    //console.log('doing searchByTag and heres the term you sent', tag);
    const state = getState();
    const contents = state.userContent.allContent;
    let filteredResults = [];
    if(tag[tag.length-1] === ',') {
      tag = tag.slice(0, tag.length-1);
    }
    const lowerCaseTag = tag.toLowerCase();
    contents.forEach((e) => {
      if (e.tags.join(' ').toLowerCase().includes(lowerCaseTag)) {
             filteredResults.push(e);
       };
     })
     //console.log('filteredResults are:', filteredResults);
     filteredResults[0]? dispatch(searchByTagResults(filteredResults)) : dispatch(searchByKeyWordNone());
 })
}
