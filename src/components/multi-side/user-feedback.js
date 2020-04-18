import React from 'react';

export function renderValidationWarnings(validation){
  let validationWarnings;
  if(validation === null) {
    return null
  } else if (typeof validation === 'string'){ //validation is being called by edit-form
    validationWarnings =
    <div className="message warning-message">
      {validation}
    </div>
  } else { //validation is being called by upload
    validationWarnings = [];
    Object.values(validation).forEach((e, i) => {
      if (e) {
        const validationWarning =
          <div
            className="message warning-message"
            key={i}
          >
            {e}
          </div>
        validationWarnings.push(validationWarning)
      }
    });
  }
  return validationWarnings
}

export function renderAsyncState(asyncState, insert){
  if(asyncState.loading === true) {
    return (
      <div className="message loading-message">
        loading...
      </div>
    )
  } else if ((asyncState.loading === false) && (asyncState.success === true)) {
    return (
      <div className="message success-message fade-out">
        {`your ${insert} was a success!`}
      </div>
    )
  } else if ((asyncState.loading === false) && (asyncState.success === false)) {
    return (
      <div className="message error-message fade-out">
        {`there was an error with your ${insert} :(`}
      </div>
    )
  } else {
    return null
  }
}
