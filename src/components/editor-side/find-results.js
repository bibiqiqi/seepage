import React from "react";
import {connect} from 'react-redux';

import Accordian from '../multi-side/accordian'

function EditorFindResults(props) {
  //if both filteredContent and filteredContentNone are false, then user hasn't submitted query
  if ((props.filteredContent.length === 0) && (!props.filteredContentNone)) {
    return null
  //if filteredContent is populated, then user has submitted query and we can render component
  } else if ((props.filteredContent.length > 0) && (!props.filteredContentNone)) {
    return (
      <section id="editor-search-results">
        <Accordian
          results={props.filteredContent}
          side='editor'
        />
      </section>
    );
  } else if (props.filteredContentNone) {
      return <p>{props.filteredContentNone}</p>
  }
}

const mapStateToProps = state => ({
  filteredContent: state.editorContent.filteredContent,
  filteredContentNone: state.editorContent.filteredContentNone,
});

export default connect(mapStateToProps)(EditorFindResults);
