import React, {Fragment} from 'react';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import * as classnames from 'classnames';

import EditorEditForm from './edit-form';
import DeleteConfirmation from './delete-confirmation';
import Thumbnails from '../multi-side/thumbnails';

const initialState = {
  hidden: {
    editForm: '',
    deleteConfirm: ''
  }
}

export default class EditorInnerCollapsible extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleEditFormExit = this.handleEditFormExit.bind(this);
    this.handlePatchCompletion = this.handlePatchCompletion.bind(this);
  }

  handleEditClick(e) {
    //when user wants to edit a field update the state to reveal an EditorEditForm component
    const value = e.currentTarget.className.slice(20);
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = value;
    this.setState({hidden}, () => {console.log('handleEditClick() ran and the updated state is:', this.state.hidden)});
  }

  handleEditFormExit(e) {
    //when user wants to exit the EditorEditForm component
    //update the state to hide the EditorEditForm component and reveal the read-only code
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = false;
    this.setState({hidden});
    //this.setState({hidden}, () => {console.log('handleEditFormExit() ran and the updated state is:', this.state.hidden.editForm)});
  }

  handleDeleteClick(e) {
    //when user wants to delete a complete content entry
    //update the state to reveal a DeleteConfirmation component
    const value = e.currentTarget.className.slice(14);
    const hidden = Object.assign({}, this.state.hidden);
    const deleteConfirm = hidden.deleteConfirm ? '' : value;
    hidden.deleteConfirm = deleteConfirm;
    this.setState({hidden}, () => {console.log('handleDeleteClick() ran and the updated state is:', this.state.hidden)});
  }

  handleDeleteConfirm(e){
    //when user confirms their request to delete a full content entry
    //updates the state to hide the DeleteConfirmation component
    const newState = cloneDeep(this.state);
    newState.collapsible = {key: null, open: false};
    newState.hidden.deleteConfirm = '';
    this.setState((prevState) => {
      return merge(prevState, newState)
    }, () => console.log('handleDeleteConfirm() ran and the updated state is', this.state.hidden));
  }

  handlePatchCompletion() {
    //gets called by child EditorEditForm component once a successful PATCH request has completed
    //hides the EditorEditForm component
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = '';
    const collapsible = {
      key: null,
      open: false,
    };
    this.setState({hidden, collapsible}, () => {console.log('handlePatchCompletion() ran and the updated state is:', this.state)});
  }

  renderEditSymbol(value) {
    //renders the pencil edit symbol for each field and holds event listener
     return(
       <span
         className = {classnames('edit', 'clickable', `edit-${value}`)}
         onClick = {(e) => this.handleEditClick(e)}
       >
        <i class="material-icons">edit</i>
       </span>
     )
   }

   renderDeleteSymbol(value) {
     //renders the delete symbol for each content entry
      return(
        <span
          className = {classnames('delete', 'float-right', 'clickable', `delete-${value}`)}
          onClick = {(e) => this.handleDeleteClick(e)}
        >
          <i class="material-icons">delete</i>
        </span>
      )
    }

    renderDeleteState(index){
      //determines whether to render or hide DeleteConfirmation component
      if (this.state.hidden.deleteConfirm === index.toString()) {
        //console.log('...and returning a DeleteConfirmation component');
        return (
          <DeleteConfirmation
            contentId={this.props.content.id}
            onDeleteExit={(e) => this.handleDeleteClick(e)}
            index={index}
            onDeleteConfirm={(e) => this.handleDeleteConfirm(e)}
          />
        )
      } else {
        //console.log('...and not returning a DeleteConfirmation component');
        return null;
      }
    }

   renderThumbnailState(content) {
     console.log('calling renderThumbnailState');
     //renders the state of the thumbnails, dependent on whether user has clicked on the content
     if (this.state.hidden.editForm === 'files') {
       //console.log('...and renderThumbnailState is rendering an edit component');
       return (
         <EditorEditForm
           content={content}
           onExit={this.handleEditFormExit}
           name='files'
           onPatchCompletion={this.handlePatchCompletion}
         />
         )
     } else {
       return (
         <Fragment>
            <h3 title='files'> Files: {this.renderEditSymbol('files')}</h3>
            <Thumbnails
              content={content}
              gallery={true}
            />
         </Fragment>
       )
     }
   }

   renderTextState(string, field, result){
     //gets called for each field except for thumbNails and files
     //and determines whether to render as an EditorEditForm component or read-only
     let renderedValue;
     if ((field === 'artistName') || (field === 'title')) {
       renderedValue = result[field];
     } else if (field === 'category') {
       renderedValue = result[field].map((category, index) => <p key={index}>{category}</p>);
     } else if (field === 'tags') {
       renderedValue = result[field].map((tag, index) => <p key={index}>{tag}</p>);
     }
     if (this.state.hidden.editForm === field) {
      return (
        <EditorEditForm
          content={result}
          onExit={this.handleEditFormExit}
          name={field}
          onPatchCompletion={this.handlePatchCompletion}
          placeholder={renderedValue}
          label={string}
        />
        )
      } else {
       return (
         <h3
           title={field}
         >{string}: {renderedValue}{this.renderEditSymbol(field)}
         </h3>
       )
     }
   }

  render(){
    const {content, index, openState} = this.props;
    if(openState) {
      //content has contentId as one of the keys, for some reason
      const strings = ['id', 'Artist Name', 'Title', 'Categories', 'Tags'];
      let details = [];
      let i = 0;
      for (let field in content) {
        if((field !== 'id') && (field !== 'files') && (field !== 'contentId')) {
          details.push(this.renderTextState(strings[i], field, content));
        }
        i++;
      }
       return (
       <div className='category-line'>
         {this.renderThumbnailState(content, index)}
         {details}
         {this.renderDeleteState(index)}
       </div>
       )
    } else {
      return null
    }
  }
}
