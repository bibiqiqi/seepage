import React, {Fragment} from "react";
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import * as classnames from 'classnames';

import Accordian from '../multi-side/accordian'
import EditorEditForm from './edit-form';
import DeleteConfirmation from './delete-confirmation';

class EditorFindResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.renderReadOrEdit = this.renderReadOrEdit.bind(this);
    this.handleEditFormExit = this.handleEditFormExit.bind(this);
    this.handlePatchCompletion = this.handlePatchCompletion.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
  }

  handleCollapsibleClick(contentId, key, contentType){
    const collapsible = cloneDeep(this.state.collapsible);
    //if a user clicks a collapsible and one of them is open...
    if (collapsible.open) {
      //test to see if the one that's open equals the one clicked
      if (key === collapsible.key) {
        collapsible.open = false
        //if so, update the state to reflect that the user is closing that collapsible
        this.setState({collapsible})
      } else {
        //if not, that means the user is trying to open a different collapsible
        //so, update the state and call fetchThumbnails for the new collapsible
        const newCollapsible = {
          contentId: contentId,
          collapsible: {
            key: key
          },
          hidden: {
            editForm: '',
            deleteConfirm: ''
          }
        }
        this.setState((prevState) => {
          return merge(prevState, newCollapsible)
        });
        collapsible.key = key;
        this.setState({collapsible});
      }
    //if user clicks a collapsible that's closed...
    } else {
      //update the state to relect that a collapsible is open and with the corresponding key
      const newState = {
        contentId: contentId,
        collapsible: {
          key: key,
          open: true
        }
      }
      this.setState((prevState) => {
        return merge(prevState, newState)
      });
   };
 }

  render(){
    //if both filteredContent and filteredContentNone are false, then user hasn't submitted query
    if ((this.props.filteredContent.length === 0) && (!this.props.filteredContentNone)) {
      return null
    //if filteredContent is populated, then user has submitted query and we can render component
  } else if ((this.props.filteredContent.length > 0) && (!this.props.filteredContentNone)) {
      const results = this.renderResults(this.props.filteredContent);
      return (
        <section id="editor-search-results">
          <Accordian/>
        </section>
      );
    } else if (this.props.filteredContentNone) {
        return <p>{this.props.filteredContentNone}</p>
    }
  }
}

const mapStateToProps = state => ({
  filteredContent: state.editorContent.filteredContent,
  filteredContentNone: state.editorContent.filteredContentNone,
});

export default connect(mapStateToProps)(EditorFindResults);
