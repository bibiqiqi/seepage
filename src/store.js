import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {reducer as formReducer} from 'redux-form';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';
import mainReducer from './reducers/main';
import {loadAuthToken} from './local-storage';

import {setAuthToken, refreshAuthToken} from './actions/auth';

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    form: formReducer,
    auth: authReducer,
    main: mainReducer,
  }), composeWithDevTools(applyMiddleware(thunk))
);

const authToken = loadAuthToken();
if (authToken) {
    const token = authToken;
    store.dispatch(setAuthToken(token));
    store.dispatch(refreshAuthToken());
}

export default store;
