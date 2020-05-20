import {
  SEARCH_BY_KEYWORD_RESULTS, searchByKeyWordResults,
  SEARCH_BY_KEYWORD_NONE, searchByKeyWordNone,
  SEARCH_BY_TAG_RESULTS, searchByTagResults,
  SEARCH_BY_TAG_NONE, searchByTagNone,
} from '../../actions/content/user-side.js';

describe('searchByKeyWordResults', () => {
    it('Should return the action', () => {
        const results = 'results';
        const action = searchByKeyWordResults(results);
        expect(action.type).toEqual(SEARCH_BY_KEYWORD_RESULTS);
        expect(action.results).toEqual(results);
    });
});

describe('searchByKeyWordNone', () => {
    it('Should return the action', () => {
      const action = searchByKeyWordNone();
      expect(action.type).toEqual(SEARCH_BY_KEYWORD_NONE);
    });
});

describe('searchByTagResults', () => {
    it('Should return the action', () => {
      const results = 'results'
      const action = searchByTagResults(results);
      expect(action.type).toEqual(SEARCH_BY_TAG_RESULTS);
      expect(action.results).toEqual(results);
    });
});

describe('searchByTagNone', () => {
    it('Should return the action', () => {
      const action = searchByTagNone();
      expect(action.type).toEqual(SEARCH_BY_TAG_NONE);
    });
});
