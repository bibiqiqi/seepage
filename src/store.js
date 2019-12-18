import {createStore, combineReducers, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {reducer as formReducer} from 'redux-form';
import thunk from 'redux-thunk';

import authReducer from './reducers/auth';
import editorContentReducer from './reducers/content/editor-side';
import userContentReducer from './reducers/content/user-side';
import {loadAuthToken} from './local-storage';

import {setAuthToken, refreshAuthToken} from './actions/auth';

const store = createStore(
  combineReducers({
    form: formReducer,
    auth: authReducer,
    editorContent: editorContentReducer,
    userContent: userContentReducer,
  }), composeWithDevTools(applyMiddleware(thunk))
);

const authToken = loadAuthToken();
if (authToken) {
    const token = authToken;
    store.dispatch(setAuthToken(token));
    store.dispatch(refreshAuthToken());
}

export default store;
