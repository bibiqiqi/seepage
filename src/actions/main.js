import React from 'react';

export const CHANGE_HIDDEN_STATE = 'CHANGE_HIDDEN_STATE';
export const changeHiddenState = hiddenChange => ({
  type: CHANGE_HIDDEN_STATE,
  hiddenChange
});
