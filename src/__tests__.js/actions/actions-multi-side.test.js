import {
  FETCH_CONTENT_REQUEST, fetchContentRequest,
  FETCH_CONTENT_SUCCESS, fetchContentSuccess,
  FETCH_CONTENT_ERROR, fetchContentError,
  OPEN_GALLERY, openGallery,
  CLOSE_GALLERY, closeGallery
} from '../../actions/content/multi-side.js';

describe('fetchContentRequest', () => {
    it('Should return the action', () => {
        const root = 'root';
        const action = fetchContentRequest(root);
        expect(action.type).toEqual(FETCH_CONTENT_REQUEST);
        expect(action.meta).toEqual(root);
    });
});

describe('fetchContentSuccess', () => {
    it('Should return the action', () => {
        const content = 'content'
        const root = 'root';
        const action = fetchContentSuccess(content, root);
        expect(action.type).toEqual(FETCH_CONTENT_SUCCESS);
        expect(action.meta).toEqual(root);
        expect(action.content).toEqual(content);
    });
});

describe('fetchContentError', () => {
    it('Should return the action', () => {
        const error = 'error'
        const root = 'root';
        const action = fetchContentError(error, root);
        expect(action.type).toEqual(FETCH_CONTENT_ERROR);
        expect(action.meta).toEqual(root);
        expect(action.error).toEqual(error);
    });
});

describe('openGallery', () => {
    it('Should return the action', () => {
        const files = 'files'
        const startingIndex = 0;
        const action = openGallery(files, startingIndex);
        expect(action.type).toEqual(OPEN_GALLERY);
        expect(action.files).toEqual(files);
        expect(action.startingIndex).toEqual(startingIndex);
    });
});

describe('closeGallery', () => {
    it('Should return the action', () => {
      const action = closeGallery();
      expect(action.type).toEqual(CLOSE_GALLERY);
    });
});
