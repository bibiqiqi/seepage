import React from "react";
import {connect} from 'react-redux';

import Accordian from '../multi-side/accordian'

class EditorFindResults extends React.Component {

  render(){
    //if both filteredContent and filteredContentNone are false, then user hasn't submitted query
    if ((!this.props.filteredContent.length) && (this.props.filteredContentNone === null)) {
      return null
    //if filteredContent is populated, then user has submitted query and we can render component
    } else if (this.props.filteredContent.length > 0) {
      return (
        <section id="editor-find-results">
          <Accordian
            results={this.props.filteredContent}
            side='editor'
          />
        </section>
      );
    } else if (this.props.filteredContentNone !== null) {
      return <p>{this.props.filteredContentNone}</p>
    }
  }
}

const mapStateToProps = state => {
  //console.log(state.editorContent.filteredContent);
  return {
    filteredContent: state.editorContent.filteredContent,
    filteredContentNone: state.editorContent.filteredContentNone
  }
}

export default connect(mapStateToProps)(EditorFindResults);
