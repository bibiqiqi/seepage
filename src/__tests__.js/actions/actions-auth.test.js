import {
  SET_AUTH_TOKEN, setAuthToken,
  CLEAR_AUTH, clearAuth,
  AUTH_REQUEST, authRequest,
  AUTH_SUCCESS, authSuccess,
  AUTH_ERROR, authError
} from '../../actions/auth.js';

describe('setAuthToken', () => {
    it('Should return the action', () => {
        const authToken = 'authToken';
        const action = setAuthToken(authToken);
        expect(action.type).toEqual(SET_AUTH_TOKEN);
        expect(action.authToken).toEqual(authToken);
    });
});

describe('clearAuth', () => {
    it('Should return the action', () => {
      const action = clearAuth();
      expect(action.type).toEqual(CLEAR_AUTH);
    });
});

describe('authRequest', () => {
    it('Should return the action', () => {
      const action = authRequest();
      expect(action.type).toEqual(AUTH_REQUEST);
    });
});

describe('authSuccess', () => {
    it('Should return the action', () => {
      const currentEditor = 'currentEditor';
      const action = authSuccess(currentEditor);
      expect(action.type).toEqual(AUTH_SUCCESS);
      expect(action.currentEditor).toEqual(currentEditor)
    });
});

describe('authError', () => {
    it('Should return the action', () => {
      const error = 'error';
      const action = authError(error);
      expect(action.type).toEqual(AUTH_ERROR);
      expect(action.error).toEqual(error);
    });
});
