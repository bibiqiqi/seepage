import userContentReducer from '../../reducers/content/user-side.js';

import {
  fetchContentRequest,
  fetchContentSuccess,
  fetchContentError,
  openGallery,
  closeGallery
} from '../../actions/content/multi-side';

import {
  searchByKeyWordResults,
  searchByKeyWordNone,
  searchByTagResults,
  searchByTagNone,
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

describe('userContentReducer', () => {
  const dummyContent = ['test1', 'test2', 'test3'];
  const dummyFiles = ['file1', 'file2', 'file3'];
  const feedback = "your query didn't match any results"

    describe('fetchContentRequest', () => {
        it('Should update the loading and error state', () => {
            let state = {loading: false, error: null}
            state = userContentReducer(state, fetchContentRequest("user"));
            expect(state).toEqual({loading: true, error: null});
        });
    });
    describe('fetchContentSuccess', () => {
        it('Should update the allContent, loading and error state', () => {
            let state = {allContent: [], loading: false, error: null}
            state = userContentReducer(state, fetchContentSuccess(dummyContent, "user"));
            expect(state).toEqual({allContent: dummyContent, loading: false, error: null});
        });
    });
    describe('fetchContentError', () => {
        it('Should update the error state', () => {
            let state = {error: null}
            const error = 'error'
            state = userContentReducer(state, fetchContentError(error, "user"));
            expect(state).toEqual({error: error});
        });
    });
    describe('openGallery', () => {
        it('Should update the galleryStarting and galleryFiles state', () => {
            let state = {galleryStarting: null, galleryFiles: []}
            state = userContentReducer(state, openGallery(dummyFiles, 0));
            expect(state).toEqual({galleryStarting: 0, galleryFiles: dummyFiles});
        });
    });
    describe('closeGallery', () => {
        it('Should update the galleryStarting and galleryFiles state', () => {
            let state = {galleryStarting: 0, galleryFiles: dummyFiles}
            state = userContentReducer(state, closeGallery());
            expect(state).toEqual({galleryStarting: null, galleryFiles: []});
        });
    });
    describe('searchByKeyWordResults', () => {
        it('Should update the searchResults and searchResultsNone state', () => {
            let state = {searchResults: [], searchResultsNone: null}
            state = userContentReducer(state, searchByKeyWordResults(dummyContent));
            expect(state).toEqual({searchResults: dummyContent, searchResultsNone: null});
        });
    });
    describe('searchByKeyWordNone', () => {
        it('Should update the searchResults and searchResultsNone state', () => {
            let state = {searchResults: [], searchResultsNone: null}
            state = userContentReducer(state, searchByKeyWordNone());
            expect(state).toEqual({searchResults: [], searchResultsNone: feedback});
        });
    });
    describe('searchByTagResults', () => {
        it('Should update the searchResults and searchResultsNone state', () => {
            let state = {searchResults: [], searchResultsNone: null}
            state = userContentReducer(state, searchByTagResults(dummyContent));
            expect(state).toEqual({searchResults: dummyContent, searchResultsNone: null});
        });
    });
    describe('searchByTagNone', () => {
        it('Should update the searchResults and searchResultsNone state', () => {
            let state = {searchResults: [], searchResultsNone: null}
            state = userContentReducer(state, searchByTagNone());
            expect(state).toEqual({searchResults: [], searchResultsNone: feedback});
        });
    });
});
