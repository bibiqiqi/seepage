import React, { Fragment } from "react";
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import {SubmissionError} from 'redux-form';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import * as classnames from 'classnames';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {API_BASE_URL} from '../../config';
import {fetchThumbNails} from '../../actions/content';
import {normalizeResponseErrors} from '../../actions/utils';
import EditorFileViewer from './file-viewer.js';
import EditorEditForm from './edit-form.js';
import DeleteConfirmation from './delete-confirmation.js';

const initialState = {
  contentId: '',
  file: {
    url: null,
    loading: false,
    error: null
  },
  collapsible: {
    key: null,
    open: false,
  },
  hidden: {
    editSymbol: {
      artistName: true,
      title: true,
      categories: true,
      tags: true,
      files: true
    },
    editForm: '',
    deleteConfirm: ''
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
    this.handleViewArt = this.handleViewArt.bind(this);
    this.handleFileViewerExit = this.handleFileViewerExit.bind(this);
  }

  fetchFile(thumbNailId) {
    const file = cloneDeep(this.state.file);
    //("doing fetchFile");
    file.loading = true;
    this.setState({file});
    return fetch(`${API_BASE_URL}/content/files/${thumbNailId}`)
      .then(res => normalizeResponseErrors(res))
      .then(res => res.blob())
      .then(blob => {
        file.loading = false;
        file.url = URL.createObjectURL(blob);
        this.setState({file});
      })
      .catch(err => {
        file.loading = false;
        file.error = err;
        this.setState({file});
      })
  };

  handleCollapsibleClick(contentId, key){
    //debugger;
    const collapsible = cloneDeep(this.state.collapsible);
    //if a user clicks a collapsible and one of them is open...
    if (collapsible.open) {
      //test to see if the one that's open equals the one clicked
      if (key === collapsible.key) {
        collapsible.open = false
        //if so, update the state to reflect none of the collapsibles are open
        this.setState({collapsible})
      } else { //if not, that means the user is trying to open a different collapsible
        //so, update the state and call fetchThumbnails for the new collapsible
        const newCollapsible = {
          contentId: contentId,
          collapsible: {
            key: key
          },
          file: {
            url: null,
            loading: false,
            error: null
          },
          hidden: {
            editForm: true
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
      const newState = {
        contentId: contentId,
        collapsible: {
          key: key,
          open: true
        }
      }
      this.props.dispatch(fetchThumbNails(contentId));
      this.setState((prevState) => {
        return merge(prevState, newState)
      });
   };
 }

  handleEditClick(e) {
    //debugger;
    const value = e.currentTarget.className.slice(10);
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = value;
    hidden.editSymbol[value] = true;
    //this.setState({hidden});
    this.setState({hidden}, () => {console.log('handleEditClick() ran and the updated state is:', this.state.hidden.editForm)});
  }

  handleDeleteClick(e) {
    console.log('handleDeleteClick() running');
    const value = e.currentTarget.className.slice(14);
    const hidden = Object.assign({}, this.state.hidden);
    const deleteConfirm = hidden.deleteConfirm ? '' : value;
    hidden.deleteConfirm = deleteConfirm;
    this.setState({hidden}, () => {console.log('handleDeleteClick() ran and the updated state is:', this.state.hidden.deleteConfirm)});
  }

  handleEditFormExit(e) {
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = false;
    this.setState({hidden});
    //this.setState({hidden}, () => {console.log('handleEditFormExit() ran and the updated state is:', this.state.hidden.editForm)});
  }

  handleDeleteConfirm(e){
    console.log('handleDeleteConfirm() running');
    //debugger;
    const newState = cloneDeep(this.state);
    newState.collapsible = {key: null, open: false};
    newState.hidden.deleteConfirm = '';
    this.setState((prevState) => {
      return merge(prevState, newState)
    }, () => console.log('handleDeleteConfirm() ran and the updated state is', this.state.hidden.deleteConfirm));
  }

  handleViewArt(e) {
    debugger;
    const key = e.currentTarget.id.slice(10);
    const thumbNailId = this.props.thumbNails[key].id;
    this.fetchFile(thumbNailId);
  }

  handleFileViewerExit(){
    const file = cloneDeep(this.state.file);
    file.url = null;
    file.error = null;
    this.setState({file}, () => {console.log('handleFileViewerExit ran and the updated state is:', this.state.file)});
  }

  handlePatchCompletion() {
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = '';
    const collapsible = {
      key: null,
      open: false,
    };
    this.setState({hidden, collapsible}, () => {console.log('handlePatchCompletion() ran and the updated state is:', this.state)});
  }

  renderEditSymbol(value) {
    //console.log('value being passed to renderEditSymbol is', value);
     return(
       <span
         className = {classnames('edit', `edit-${value}`)}
         onClick = {(e) => this.handleEditClick(e)}
       >$</span>
     )
   }

   renderDeleteSymbol(value) {
      return(
        <span
          className = {classnames('delete', `delete-${value}`)}
          onClick = {(e) => this.handleDeleteClick(e)}
        >3</span>
      )
    }

    renderDeleteState(index){
      //console.log('renderDeleteState() is running and passing this index', index);
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

   //defining the state of the thumbnails (dependent on whether user has clicked on the content)
   renderThumbNailState() {
     //console.log('renderThumbNailState() running');
     //if this.state.editForm equals 'files', then render component as a EditForm
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
         const thumbNails = this.props.thumbNails.map((e, i) => {
           //debugger;
           return (
             <div
               className='thumbNail'
               title='files'
             >
              <img
                key={i}
                src={e.src}
                id={`thumbnail_${i}`}
                onClick={this.handleViewArt}
              >
              </img>
              {this.renderEditSymbol('files')}
            </div>
           )
         });
         //console.log('...and returning these thumbNails:', thumbNails);
         return thumbNails
       } else {
         return null;
       }
     }
   }

   //defining the state of the fileViewer (dependent on whether user has clicked on a thumbnail)
   renderFileViewerState() {
     if (this.state.file.loading){
       return toast('loading');;
     } else if (this.state.file.url) {
         return <EditorFileViewer
                 url={this.state.file.url}
                 handleExitClick={this.handleFileViewerExit}
                 />
     } else if (this.state.file.error) {
       return toast.error('sorry, there was an error retrieving the file');
     } else {
       return null
     }
   }

   renderReadOrEdit(collapsibleKey, string, field, value){
     //console.log('running renderReadOrEdit() and the values passed are:', string, field, value);
     let renderedValue;
     if ((field === 'artistName') || (field === 'title')) {
       renderedValue = value;
     } else if (field === 'category') {
       renderedValue = value.map((category, index) => <p key={index}>{category}</p>);
     } else if (field === 'tags') {
       renderedValue = value.map((tag, index) => <p key={index}>{tag}</p>);
     }
     if ((this.state.hidden.editForm === field) && (this.state.collapsible.key === collapsibleKey)) {
      //console.log('...and renderReadOrEdit is rendering an edit component');
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
       //console.log('...and renderReadOrEdit is rendering a read component');
       return (
         <h3
           title={field}
         >{string}: {renderedValue}{this.renderEditSymbol(field)}
         </h3>
       )
     }
   }

   renderResults(filteredContent) {
     //debugger;
     console.log('renderResults() running')
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

       //console.log('items that are being sent to this collapsible are:', details);
       return (
         <li key={index} className='result'>
           <Collapsible
             open={this.state.collapsible.open && this.state.collapsible.key===index}
             trigger={`${result.title} by ${result.artistName}`}
             handleTriggerClick={(e) => this.handleCollapsibleClick(result.id, index)}
           >
           {this.renderDeleteSymbol(index)}
           {details}
           {this.renderThumbNailState()}
           {this.renderFileViewerState()}
           {this.renderDeleteState(index)}
           </Collapsible>
         </li>
       )
     });
   }

  render(){
    //debugger;
    ////the overall collapsible component
    //if both filteredContent and filteredContentNone are false, then user hasn't submitted query
    if ((this.props.filteredContent.length === 0) && (!this.props.filteredContentNone)) {
      return null
    //if filteredContent is populated, then user has submitted query and we can render component
  } else if ((this.props.filteredContent.length > 0) && (!this.props.filteredContentNone)) {
      const results = this.renderResults(this.props.filteredContent);
      //console.log('results being sent to this components render are:', results);
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
