import React, {Fragment} from 'react';
import * as classnames from 'classnames';

import EditorEditForm from './edit-form';
import DeleteConfirmation from './delete-confirmation';
import Thumbnails from '../multi-side/thumbnails';

import './inner-collapsible.css';

export default class EditorInnerCollapsible extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: {
        editForm: '',
        deleteConfirm: ''
      }
    }
    this.handleEditFormExit = this.handleEditFormExit.bind(this);
    this.handlePatchCompletion = this.handlePatchCompletion.bind(this);
  }

  handleEditClick(e) {
    //when user wants to edit a field update the state to reveal an EditorEditForm component
    const value = e.currentTarget.className.slice(35);
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = value;
    this.setState({hidden});
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
    const value = e.currentTarget.className.slice(51);
    const hidden = Object.assign({}, this.state.hidden);
    const deleteConfirm = hidden.deleteConfirm ? '' : value;
    hidden.deleteConfirm = deleteConfirm;
    this.setState({hidden});
  }

  handleDeleteConfirm(e){
    //when user confirms their request to delete a full content entry
    //updates the state to hide the DeleteConfirmation component
    const hidden = Object.assign({}, this.state.hidden);
    hidden.deleteConfirm = '';
    this.setState({hidden});
    this.props.onCloseCollapsible();
  }

  handlePatchCompletion() {
    //gets called by child EditorEditForm component once a successful PATCH request has completed
    //hides the EditorEditForm component
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = '';
    this.setState({hidden});
  }

  renderEditSymbol(value) {
    //renders the pencil edit symbol for each field and holds event listener
     return(
        <i
          className = {classnames('material-icons', 'edit', 'clickable', `edit-${value}`)}
          onClick = {(e) => this.handleEditClick(e)}
        >edit
        </i>
     )
   }

   renderDeleteSymbol(index) {
     //renders the delete symbol for each content entry
      return(
        <i
          className = {classnames('delete', 'material-icons', 'float-right', 'clickable', `delete-${index}`)}
          onClick = {(e) => this.handleDeleteClick(e)}
        >delete
        </i>
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
            <h4 title='files'>{this.renderEditSymbol('files')}Files:</h4>
            <Thumbnails
              content={content}
              gallery={true}
              playing={false}
            />
         </Fragment>
       )
     }
   }

   renderListWithCommas(array){
     let list = '';
     for(let i = 0; i < array.length; i++) {
       if(i < array.length - 1) {
         list += array[i] + ', '
       } else list += array[i]
     }
     return list
   }

   renderTextState(field, result){
     //gets called for each field except for thumbNails and files
     //and determines whether to render as an EditorEditForm component or read-only
     let key, value;
     if ((field === 'artistName') || (field === 'title') || (field === 'description')) {
       value = result[field];
       if(field === 'artistName') {
         key = 'Artist Name'
       } else if (field === 'title') {
         key = 'Title';
       } else if (field === 'description') {
         key = 'Description';
       }
     } else if ((field === 'category') || (field === 'tags')) {
       value = this.renderListWithCommas(result[field])
       if(field === 'category') {
         key = 'Category'
       } else if(field === 'tags') {
         key = 'Tags'
       }
     }
     if (this.state.hidden.editForm === field) {
      return (
        <EditorEditForm
          content={result}
          onExit={this.handleEditFormExit}
          name={field}
          onPatchCompletion={this.handlePatchCompletion}
          placeholder={value}
          label={key}
        />
        )
      } else {
       return (
         <div className={`edit-results-flex edit-${field}`} title={field}>
          {this.renderEditSymbol(field)}
          <h4>{key}: </h4>
          <h4>{value}</h4>
         </div>

       )
     }
   }

  render(){
    const {content, index, openState} = this.props;
    if(openState) {
      if(this.state.hidden.deleteConfirm === index.toString()){
        return (
          <div className='category-line'>
            <DeleteConfirmation
              contentId={this.props.content.id}
              onDeleteExit={(e) => this.handleDeleteClick(e)}
              index={index}
              onDeleteConfirm={(e) => this.handleDeleteConfirm(e)}
            />
          </div>
        )
      } else {
        //content has contentId as one of the keys, for some reason
        let details = [];
        for (let field in content) {
          if((field !== 'id') && (field !== 'files')){
            details.push(this.renderTextState(field, content));
          }
        }
         return (
         <div className='inner-collapsible'>
           {this.renderDeleteSymbol(index)}
           {this.renderThumbnailState(content, index)}
           {details}
           {this.renderDeleteState(index)}
         </div>
         )
      }
    } else {
      return null
    }
  }
}
