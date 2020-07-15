import editorContentReducer from '../../reducers/content/editor-side.js';

import {
  fetchContentRequest,
  fetchContentSuccess,
  fetchContentError,
  openGallery,
  closeGallery
} from '../../actions/content/multi-side';

import {
  filterContentSuccess,
  filterContentNone,
  makeSuggestedArtists,
  makeSuggestedTitles,
  makeSuggestedTags
} from '../../actions/content/editor-side.js';

describe('editorContentReducer', () => {
  const dummyContent = ['test1', 'test2', 'test3'];
  const dummyFiles = ['file1', 'file2', 'file3'];
  const feedback = "your query didn't match any results";

    describe('fetchContentRequest', () => {
        it('Should update the loading and error state', () => {
            let state = {loading: false, error: null}
            state = editorContentReducer(state, fetchContentRequest("editor"));
            expect(state).toEqual({loading: true, error: null});
        });
    });
    describe('fetchContentSuccess', () => {
        it('Should update the allContent, loading and error state', () => {
            let state = {allContent: [], loading: false, error: null}
            state = editorContentReducer(state, fetchContentSuccess(dummyContent, "editor"));
            expect(state).toEqual({allContent: dummyContent, loading: false, error: null});
        });
    });
    describe('fetchContentError', () => {
        it('Should update the error state', () => {
            let state = {error: null}
            const error = 'error'
            state = editorContentReducer(state, fetchContentError(error, "editor"));
            expect(state).toEqual({error: error});
        });
    });
    describe('openGallery', () => {
        it('Should update the galleryStarting and galleryFiles state', () => {
            let state = {galleryStarting: null, galleryFiles: []}
            state = editorContentReducer(state, openGallery(dummyFiles, 0));
            expect(state).toEqual({galleryStarting: 0, galleryFiles: dummyFiles});
        });
    });
    describe('closeGallery', () => {
        it('Should update the galleryStarting and galleryFiles state', () => {
            let state = {galleryStarting: 0, galleryFiles: dummyFiles}
            state = editorContentReducer(state, closeGallery());
            expect(state).toEqual({galleryStarting: null, galleryFiles: []});
        });
    });
    describe('filterContentSuccess', () => {
        it('Should update the filteredContent and filteredContentNone state', () => {
            let state = {filteredContent: []}
            state = editorContentReducer(state, filterContentSuccess(dummyContent));
            expect(state).toEqual({filteredContent: dummyContent, filteredContentNone: null});
        });
    });
    describe('filterContentNone', () => {
        it('Should update the filteredContentNone state', () => {
            let state = {filteredContentNone: null}
            state = editorContentReducer(state, filterContentNone());
            expect(state).toEqual({filteredContent: [], filteredContentNone: "your query didn't match any results"});
        });
    });
    describe('makeSuggestedArtists', () => {
        it('Should update the makeSuggestedArtists state', () => {
            let state = {suggestedArtists: []}
            state = editorContentReducer(state, makeSuggestedArtists(dummyContent));
            expect(state).toEqual({suggestedArtists: dummyContent});
        });
    });
    describe('makeSuggestedTitles', () => {
        it('Should update the makeSuggestedTitles state', () => {
            let state = {suggestedTitles: []}
            state = editorContentReducer(state, makeSuggestedTitles(dummyContent));
            expect(state).toEqual({suggestedTitles: dummyContent});
        });
    });
    describe('makeSuggestedTags', () => {
        it('Should update the makeSuggestedTags state', () => {
            let state = {suggestedTags: []}
            state = editorContentReducer(state, makeSuggestedTags(dummyContent));
            expect(state).toEqual({suggestedTags: dummyContent});
        });
    });
});
