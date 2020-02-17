import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import './search-results.css'

import Accordian from '../multi-side/accordian';

function SearchResults(props) {
  if(props.show) {
    //if both searchResults and searchResultsNone are false, then user hasn't submitted query
    if (props.searchResults.length) {
        return (
          <div id="user-search-results">
            <i
              className={classnames('exit', 'float-right', 'clickable', 'material-icons')}
              onClick = {() => props.onExitClick()}
            >close
            </i>
            <Accordian
              results={props.searchResults}
              side='user'
              submits={props.submits}
            />
          </div>
        );
      } else if (props.searchResultsNone !== null) {
          return <div class='message success-message'>{props.searchResultsNone}</div>
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
