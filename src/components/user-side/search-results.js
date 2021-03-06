import React from 'react';
import {connect} from 'react-redux';
import './search-results.css'

import Accordian from '../multi-side/accordian';
import {Button} from '../multi-side/clickables';

export function SearchResults(props) {
  if(props.show) {
    //if both searchResults and searchResultsNone are false, then user hasn't submitted query
    if(props.searchResults.length) {
        return (
          <div id="user-search-results">
            <div className="top-bar">
              <Button
                className='clickable exit float-right'
                handleClick={props.onExitClick}
                glyph='close'
              />
            </div>
            <Accordian
              results={props.searchResults}
              side='user'
              submits={props.submits}
            />
          </div>
        );
      } else if (props.searchResultsNone !== null) {
          return <div className='message success-message'>{props.searchResultsNone}</div>
      } else {
        return null
      }
    } else {
      return null
    }
}

const mapStateToProps = state => ({
  searchResults: state.userContent.searchResults,
  searchResultsNone: state.userContent.searchResultsNone,
});

export default connect(mapStateToProps)(SearchResults);
