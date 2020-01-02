import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';

import Accordian from '../multi-side/accordian';

function SearchResults(props) {
  if(props.show) {
    //if both searchResults and searchResultsNone are false, then user hasn't submitted query
    if ((props.searchResults.length > 0) && (!props.searchResultsNone)) {
        return (
          <section id="user-search-results">
            <span
              className = {classnames('exit', 'float-right', 'clickable')}
              onClick = {() => props.onExitClick()}
            >
              <i class="material-icons">close</i>
            </span>
            <div className='collaps-container'>
              <Accordian
                results={props.searchResults}
                side='user'
              />
            </div>
          </section>
        );
      } else if (props.searchResultsNone) {
          return <p>{props.searchResultsNone}</p>
      }
    } else {
      return null
    }
}

const mapStateToProps = state => ({
  searchResults: state.userContent.searchByKeyWordResults,
  searchResultsNone: state.userContent.searchByKeyWordResultsNone,
});

export default connect(mapStateToProps)(SearchResults);
