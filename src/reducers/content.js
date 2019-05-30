import {
    FILTER_CONTENT_SUCCESS,
    FETCH_CONTENT_SUCCESS,
    FETCH_CONTENT_ERROR,
    FETCH_CONTENT_REQUEST,
} from '../actions/content';

const initialState = {
    allContent: '',
    filteredContent: '',
    loading: false,
    error: null,
};

export const filterContent = (filterObject) => {
  console.log(filterObject);
  // const filteredContent = {};
  // initialState.allContent.forEach((e,i) => {
  //   for (const key in e) {
  //     if (key === value) {
  //       newState[key] = false;
  //       //console.log('new state is:', newState);
  //       this.setState(newState);
  //     }
  //   }
  // })
};

export default function reducer(state = initialState, action) {
    if (action.type === FILTER_CONTENT_SUCCESS) {
      return Object.assign({}, state, {
       filteredContent: action.filteredContent,
      })
    } else if (action.type === FETCH_CONTENT_SUCCESS) {
        return Object.assign({}, state, {
          allContent: action.content,
          error: null
        });
    } else if (action.type === FETCH_CONTENT_ERROR) {
        return Object.assign({}, state, {
          error: action.error
        });
    } else if (action.type === FETCH_CONTENT_REQUEST) {
        return Object.assign({}, state, {
          loading: true,
          error: null
        });
    }
    return state;
}
