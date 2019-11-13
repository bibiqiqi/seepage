import React from "react";
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import * as classnames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';

import {fetchThumbNails} from '../../actions/content';
import EditorGallery from './gallery.js';
import EditorEditForm from './edit-form.js';
import DeleteConfirmation from './delete-confirmation.js';

const initialState = {
  contentId: '',
  collapsible: {
    key: null,
    open: false,
  },
  hidden: {
    editForm: '',
    deleteConfirm: '',
    gallery: {
      open: false,
      firstArtIndex: null,
      thumbNailIds: null
    }
  }
}

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
    this.handleGalleryClick = this.handleGalleryClick.bind(this);
    this.handleGalleryExit = this.handleGalleryExit.bind(this);
  }

  handleCollapsibleClick(contentId, key){
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
            deleteConfirm: '',
            gallery: {
              open: false,
              firstArtIndex: null,
              thumbNailIds: null
            }
          }
        }
        this.setState((prevState) => {
          return merge(prevState, newCollapsible)
        });
        collapsible.key = key;
        this.setState({collapsible});
        this.props.dispatch(fetchThumbNails(contentId));
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
      //...and dispatch fetchThumbNails
      this.props.dispatch(fetchThumbNails(contentId));
      this.setState((prevState) => {
        return merge(prevState, newState)
      });
   };
 }

  handleEditClick(e) {
    //when user wants to edit a field
    //update the state to reveal an EditorEditForm component
    const value = e.currentTarget.className.slice(10);
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = value;
    this.setState({hidden}, () => {console.log('handleEditClick() ran and the updated state is:', this.state.hidden)});
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

  handleEditFormExit(e) {
    //when user wants to exit the EditorEditForm component
    //update the state to hide the EditorEditForm component and reveal the read-only code
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = false;
    this.setState({hidden});
    //this.setState({hidden}, () => {console.log('handleEditFormExit() ran and the updated state is:', this.state.hidden.editForm)});
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

  handleGalleryClick(e) {
    //updates the state with the objectId of the thumbNail that was chosen
    //and an array of the objectIds of all the other thumbNails so they can be sent to gallery component
    //and reveals the EditorGallery component
    const hidden = cloneDeep(this.state.hidden);
    hidden.gallery.firstArtIndex = e.currentTarget.id.slice(10);
    hidden.gallery.thumbNailIds = this.props.thumbNails.map(e => {
      return e.id
    })
    hidden.gallery.open = true;
    this.setState({hidden}, () => {console.log('handleGalleryClick ran and the updated state is:', this.state.hidden.gallery)});
  }

  handleGalleryExit(){
    //when user wants to exit the gallery
    //updates the state to hide the EditorGallery component
    const hidden = cloneDeep(this.state.hidden);
    hidden.gallery = {
      open: false,
      firstArtIndex: '',
      thumbNailIds: null
    }
    this.setState({hidden}, () => {console.log('handleGalleryExit ran and the updated state is:', this.state.hidden.gallery)});
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
         className = {classnames('edit', `edit-${value}`)}
         onClick = {(e) => this.handleEditClick(e)}
       >$</span>
     )
   }

   renderDeleteSymbol(value) {
     //renders the garbage can delete symbol for each content entry
      return(
        <span
          className = {classnames('delete', `delete-${value}`)}
          onClick = {(e) => this.handleDeleteClick(e)}
        >3</span>
      )
    }

    renderDeleteState(index){
      //determines whether to render or hide DeleteConfirmation component
      if (this.state.hidden.deleteConfirm === index.toString()) {
        //console.log('...and returning a DeleteConfirmation component');
        return (
          <DeleteConfirmation
            contentId={this.state.contentId}
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

   renderThumbNailState(content) {
     //renders the state of the thumbnails, dependent on whether user has clicked on the content
     if (this.state.hidden.editForm === 'files') {
       //console.log('...and renderThumbNailState is rendering an edit component');
       return (
         <EditorEditForm
           contentId={this.state.contentId}
           onExit={this.handleEditFormExit}
           name='files'
           onPatchCompletion={this.handlePatchCompletion}
         />
         )
     } else {
       if (this.props.thumbNails){
         //if the redux state of thumbNails is populated, then generate html from them
         const thumbNails = this.props.thumbNails.map((e, i) => {
           return (
             <div
               className='thumbNail'
             >
              <img
                key={i}
                src={e.src}
                id={`thumbnail_${i}`}
                alt={`thumbnail ${i} for ${content.title}, by ${content.artist}`}
                onClick={this.handleGalleryClick}
              >
              </img>
              {this.renderEditSymbol('files')}
            </div>
           )
         });
         return thumbNails
       } else {
         return null;
       }
     }
   }

   renderGalleryState(result) {
     //determines whether to render EditorGallery component or hide it
     //dependent on whether use has clicked on a thumb nail
     if (this.state.hidden.gallery.open) {
       return (
         <EditorGallery
           firstArtIndex={this.state.hidden.gallery.firstArtIndex}
           thumbNailIds={this.state.hidden.gallery.thumbNailIds}
           onExitClick={this.handleGalleryExit}
           alt={`file for ${result.title} by ${result.artist}`}
          />
       )
     } else {
       return null
     }
   }

   renderReadOrEdit(collapsibleKey, string, field, value){
     //gets called for each field except for thumbNails and files
     //and determines whether to render as an EditorEditForm component or read-only
     let renderedValue;
     if ((field === 'artistName') || (field === 'title')) {
       renderedValue = value;
     } else if (field === 'category') {
       renderedValue = value.map((category, index) => <p key={index}>{category}</p>);
     } else if (field === 'tags') {
       renderedValue = value.map((tag, index) => <p key={index}>{tag}</p>);
     }
     if ((this.state.hidden.editForm === field) && (this.state.collapsible.key === collapsibleKey)) {
      return (
        <EditorEditForm
          contentId={this.state.contentId}
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

   renderResults(filteredContent) {
     //maps through all the filtered results from user's query and calls other functions to
     //render all of the code within a collapsible
     const strings = ['id', 'Artist Name', 'Title', 'Categories', 'Tags'];
     return filteredContent.map((result, index) => {
       let details = [];
       let i = 0;
       for (let field in result) {
         if(field !== 'id') {
           details.push(this.renderReadOrEdit(index, strings[i], field, result[field]));
         }
        i++;
       }
       return (
         <li key={index} className='result'>
           <Collapsible
             open={this.state.collapsible.open && this.state.collapsible.key===index}
             trigger={`${result.title} by ${result.artistName}`}
             handleTriggerClick={(e) => this.handleCollapsibleClick(result.id, index)}
           >
           {this.renderDeleteSymbol(index)}
           {details}
           {this.renderGalleryState(result)}
           {this.renderThumbNailState(result)}
           {this.renderDeleteState(index)}
           </Collapsible>
         </li>
       )
     });
   }

  render(){
    //if both filteredContent and filteredContentNone are false, then user hasn't submitted query
    if ((this.props.filteredContent.length === 0) && (!this.props.filteredContentNone)) {
      return null
    //if filteredContent is populated, then user has submitted query and we can render component
  } else if ((this.props.filteredContent.length > 0) && (!this.props.filteredContentNone)) {
      const results = this.renderResults(this.props.filteredContent);
      return (
        <div>
         <h3>Results</h3>
         <ul>
           {results}
         </ul>
        </div>
      );
    } else if (this.props.filteredContentNone) {
        return <p>{this.props.filteredContentNone}</p>
    }
  }
}

const mapStateToProps = state => ({
  filteredContent: state.content.filteredContent,
  filteredContentNone: state.content.filteredContentNone,
  thumbNails: state.content.thumbNails
});

export default connect(mapStateToProps)(EditorFindResults);
