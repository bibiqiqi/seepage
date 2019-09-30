import React from 'react';
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import {SubmissionError} from 'redux-form';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import {ToastContainer, toast} from 'react-toastify';
import * as classnames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';

import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';
import EditorFileViewer from './file-viewer.js';
import EditorEditForm from './edit-form.js';

class EditorFindResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {
        loading: false,
        error: null,
        url: ''
      },
      thumbNails: {
        loading: false,
        error: null,
        array: []
      },
      collapsible: {
        key: null,
        open: false,
      },
      contentId: '',
      hidden: {
        editSymbol: {
          artistName: true,
          title: true,
          categories: true,
          tags: true,
          files: true
        },
        editForm: ''
      }
    }
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.renderReadOrEdit = this.renderReadOrEdit.bind(this);
  }

  arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
  };

  fetchThumbnails(contentId) {
    //debugger;
    const thumbNails = cloneDeep(this.state.thumbNails);
    //const thumbNails = Object.assign({}, this.state.thumbNails);
    console.log("doing fetchThumbnails");
    thumbNails.loading = true;
    this.setState({thumbNails});
    return fetch(`${API_BASE_URL}/content/thumbnails/${contentId}`)
      .then(res => normalizeResponseErrors(res))
      .then(res => res.json())
      .then(data => {
        const base64Flag = 'data:image/jpeg;base64, ';
        thumbNails.array = data.thumbNails.map((e) => {
           const thumbnail = {};
           thumbnail.key = e.key;
           const imageStr = this.arrayBufferToBase64(e.data.data);
           thumbnail.file = base64Flag + imageStr;
           return thumbnail;
       })
        thumbNails.loading = false;
        this.setState({thumbNails});
        //debugger;
      })
      .catch(err => {
        thumbNails.error = err;
        this.setState({thumbNails})
      })
  }

  fetchFile(contentId, key) {
    const file = cloneDeep(this.state.file);
    console.log("doing fetchFile");
    file.loading = true;
    this.setState({file});
    return fetch(`${API_BASE_URL}/content/files/${contentId}/${key}`)
      .then(res => normalizeResponseErrors(res))
      .then(res => res.blob())
      .then(blob => {
        file.url = URL.createObjectURL(blob);
        file.loading = false;
        this.setState({file});
      })
      .catch(err => {
        file.error = err;
        this.setState({file});
      })
  };

  // fetchArt(e) {
  //   //debugger;
  //   const key = parseInt(e.currentTarget.id.slice(10), 10);
  //   this.fetchFile(this.state.contentId, key);
  // }

  handleCollapsibleClick(contentId, key){
    //debugger;
    const state = cloneDeep(this.state);
    const collapsible = state.collapsible;
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
            url: ''
          },
          hidden: {
            editSymbol: true,
            editForm: true,
          }
        }
        this.setState((prevState) => {
          return merge(prevState, newCollapsible)
        });
        collapsible.key = key;
        this.setState({collapsible});
        this.fetchThumbnails(contentId);
      }
    //if user clicks a collapsible that's closed...
    } else {
      const fetchingThumbNailState = {
        contentId: contentId,
        collapsible: {
          key: key,
          open: true
        },
        thumbNails: {
          loading: true,
          error: null,
          array: []
        }
      }
      this.setState((prevState) => {
        return merge(prevState, fetchingThumbNailState)
      });
      this.fetchThumbnails(contentId);
   };
 }

  handleMouseOver(event){
    //debugger;
    const name = event.currentTarget.title;
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editSymbol[name] = false;
    this.setState({hidden}, () => {console.log('handleMouseOver() ran and the updated state is:', this.state.hidden.editSymbol)});
  }

  handleMouseOut(event){
    //debugger;
    const name = event.currentTarget.title;
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editSymbol[name] = true;
    this.setState({hidden}, () => {console.log('handleMouseOut() ran and the updated state is:', this.state.hidden.editSymbol)});
  }

  handleEditClick(e) {
    debugger;
    const value = e.currentTarget.className.slice(10);
    const hidden = Object.assign({}, this.state.hidden);
    hidden.editForm = value;
    hidden.editSymbol[value] = true;
    this.setState({hidden}, () => {console.log('handleEditClick() ran and the updated state is:', this.state.hidden.editForm)});
  }

  renderEditSymbol(value) {
    console.log('value being passed to renderEditSymbol is', value);
     return(
       <span
         className = {classnames('edit', `edit-${value}`, {hidden: this.state.hidden.editSymbol[value]})}
         onClick = {(e) => this.handleEditClick(e)}
       >$</span>
     )
   }

   //defining the state of the thumbnails (dependent on whether user has clicked on the content)
   renderThumbNailState() {
     if (this.state.thumbNails.loading){
       return toast('loading');
     } else if (this.state.thumbNails.array) {
       const thumbNails = this.state.thumbNails.array.map((e) => {
         return <img src={e.file} key={e.key} id={`thumbnail_${e.key}`} height='100' width='100' onClick={this.viewArt} name="categories" onMouseOver={this.handleMouseOver}
         onMouseOut={this.handleMouseOut} title='files'/>
       });
       return (thumbNails)
     } else if (this.state.thumbNails.error) {
       return toast.error('sorry, there was an error retrieving the files');
     } else {
       return null;
     }
   }

   //defining the state of the fileViewer (dependent on whether user has clicked on a thumbnail)
   renderFileViewerState() {
     if (this.state.file.loading){
       return toast('loading');;
     } else if (this.state.file.url) {
         return <EditorFileViewer
                 url={this.state.file.url}
                 />
     } else if (this.state.file.error) {
       return toast.error('sorry, there was an error retrieving the file');
     };
   }

   renderReadOrEdit(string, key, value){
     console.log('running renderReadOrEdit() and the values passed are:', string, key, value);
     let renderedValue;
     if ((key === 'artistName') || (key === 'title')) {
       renderedValue = value;
     } else if (key === 'category') {
       renderedValue = value.map((category, index) => <p key={index}>{category}</p>);
     } else if (key === 'tags') {
       renderedValue = value.map((tag, index) => <p key={index}>{tag}</p>);
     }
     if (!(this.state.hidden.editForm)) {
       return (
         <h3
           title={key}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}
         >{string}: {renderedValue}{this.renderEditSymbol(key)}
         </h3>
       )
     } else {
      return
        <EditorEditForm
          name={key}
          placeholder={renderedValue}
          label={string}
        />
      }
   }

   renderResults(filteredContent) {
     //debugger;
     const strings = ['id', 'Artist Name', 'Title', 'Categories', 'Tags'];
     return filteredContent.map((result, index) => {
       let details = [];
       let i = 0;
       for (let key in result) {
         if(key !== 'id') {
           details.push(this.renderReadOrEdit(strings[i], key, result[key]));
         }
        i++;
       }
       console.log('items that are being sent to this collapsible are:', details);
       return (
         <li key={index} className='result'>
           <Collapsible
             open={this.state.collapsible.open && this.state.collapsible.key===index}
             trigger={`${result.title} by ${result.artistName}`}
             handleTriggerClick={(e) => this.handleCollapsibleClick(result.id, index)}
           >
           {details}
           {this.renderEditSymbol('files')}
           {this.renderFileViewerState()}
           {this.renderThumbNailState()}
           </Collapsible>
         </li>
       )
     });
   }

  render(){
    ////the overall collapsible component
    //if both filteredContent and filteredContentNone are false, then user hasn't submitted query
    <ToastContainer/>
    if ((!this.props.filteredContent) && (!this.props.filteredContentNone)) {
      return null
    //if filteredContent is populated, then user has submitted query and we can render component
    } else if (this.props.filteredContent) {
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
  filteredContentNone: state.content.filteredContentNone
});

export default connect(mapStateToProps)(EditorFindResults);
