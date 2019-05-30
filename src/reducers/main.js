import {
    CHANGE_HIDDEN_STATE
} from '../actions/main';

const initialState = {
  hidden: {
    searchBy: {
      artistName: true,
      title: true,
      tag: true
    },
    findResults: {
      browse: true,
      search: true,
      media: true,
      text: true,
      performance: true
    }
  }
}

export default function mainReducer(state = initialState, action) {
  if (action.type === CHANGE_HIDDEN_STATE) {
    console.log(action.hiddenChange);
    const hiddenChange = action.hiddenChange.searchBy;
      return Object.assign({}, state.hidden, {
        searchBy: hiddenChange
      })
    }
  return state;
}
