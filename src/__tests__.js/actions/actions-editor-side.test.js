import {
  FILTER_CONTENT_SUCCESS, filterContentSuccess,
  FILTER_CONTENT_NONE, filterContentNone,
  MAKE_SUGGESTED_ARTISTS, makeSuggestedArtists,
  MAKE_SUGGESTED_TITLES, makeSuggestedTitles,
  MAKE_SUGGESTED_TAGS, makeSuggestedTags
} from '../../actions/content/editor-side.js';

describe('filterContentSuccess', () => {
    it('Should return the action', () => {
        const filteredContent = 'content';
        const action = filterContentSuccess(filteredContent);
        expect(action.type).toEqual(FILTER_CONTENT_SUCCESS);
        expect(action.filteredContent).toEqual(filteredContent);
    });
});

describe('filterContentNone', () => {
    it('Should return the action', () => {
        const action = filterContentNone();
        expect(action.type).toEqual(FILTER_CONTENT_NONE);
    });
});

describe('makeSuggestedArtists', () => {
    it('Should return the action', () => {
        const suggestedArtists = 'suggestedArtists';
        const action = makeSuggestedArtists(suggestedArtists);
        expect(action.type).toEqual(MAKE_SUGGESTED_ARTISTS);
        expect(action.suggestedArtists).toEqual(suggestedArtists);
    });
});

describe('makeSuggestedTitles', () => {
    it('Should return the action', () => {
        const suggestedTitles = 'suggestedTitles';
        const action = makeSuggestedTitles(suggestedTitles);
        expect(action.type).toEqual(MAKE_SUGGESTED_TITLES);
        expect(action.suggestedTitles).toEqual(suggestedTitles);
    });
});

describe('makeSuggestedTags', () => {
    it('Should return the action', () => {
        const suggestedTags = 'suggestedTags';
        const action = makeSuggestedTags(suggestedTags);
        expect(action.type).toEqual(MAKE_SUGGESTED_TAGS);
        expect(action.suggestedTags).toEqual(suggestedTags);
    });
});
