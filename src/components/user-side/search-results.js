import React, { Fragment } from "react";
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import cloneDeep from 'clone-deep';
import merge from 'deepmerge';
import * as classnames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';

import Gallery from '../multi-side/gallery';
import Thumbnails from '../multi-side/thumb-nails';

const initialState = {
  contentId: '',
  collapsible: {
    key: null,
    open: false,
  },
  gallery: {
    open: false,
    firstArtIndex: null,
    fileIds: null
  }
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
  }

  componentDidUpdate(prevProps) {
    if (this.props.submits !== prevProps.submits) {
      const collapsible = {
        key: null,
        open: false
      };
      this.setState({collapsible})
    }
  }

  handleCollapsibleClick(contentId, key) {
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
          gallery: {
            open: false,
            firstArtIndex: null,
            fileIds: null
          }
        }
        this.setState((prevState) => {
          return merge(prevState, newCollapsible)
        });
      }
    //if user clicks a collapsible that's closed...
    } else {
      //update the state to relect that a collapsible is open and with the corresponding key
      console.log('updating the state to open the collapsible');
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

 renderThumbNailState(content, index) {
   //renders the state of the thumbnails, dependent on whether user has clicked on the content
   //if the redux state of thumbNails is populated, then generate html from them
   if(this.state.collapsible.open && this.state.collapsible.key===index) {
     return (
       <Thumbnails
        content={content}
        gallery={true}
       />
     )
   } else {
     return null
   }
 }

 renderDetail(string, value){
   //gets called for each field except for thumbNails and files
   //and determines whether to render as an EditorEditForm component or read-only
   let renderedValue;
   if ((string === 'Artist Name') || (string === 'Title')) {
     renderedValue = value;
   } else if (string === 'Categories') {
     renderedValue = value.map((category, index) => <p key={index}>{category}</p>);
   } else if (string === 'Tags') {
     renderedValue = value.map((tag, index) => <p key={index}>{tag}</p>);
   }
   return (
     <h3
     >{string}: {renderedValue}
     </h3>
   )
 }

 renderInnerCollapsible(result, index){
   if(this.state.collapsible.open && this.state.collapsible.key===index){
     const strings = ['id', 'Artist Name', 'Title', 'Categories', 'Tags'];
     const details = [];
      strings.forEach((string, i) => {
       if(string !== 'id') {
         const value = Object.values(result)[i];
         details.push(this.renderDetail(string, value));
       }
     });
      return (
      <Fragment>
        {details}
        {this.renderThumbNailState(result, index)}
      </Fragment>
      )
   } else {
     return null
   }
 }

 renderResults(){
   if((this.props.searchResults.length) && (!this.props.searchResultsNone)) {
       const results = this.props.searchResults;
       //maps through all the filtered results from user's search and calls other functions to
       //render all of the code within a collapsible
       return results.map((result, index) => {
         return (
           <li key={index} className='result'>
             <Collapsible
               open={this.state.collapsible.open && this.state.collapsible.key===index}
               trigger={`${result.title} by ${result.artistName}`}
               handleTriggerClick={(e) => this.handleCollapsibleClick(result.id, index, result.contentType)}
             >
             {this.renderInnerCollapsible(result, index)}
             {this.renderGalleryState(result)}
             </Collapsible>
           </li>
         )
       })
     } else if (this.props.searchResultsNone) {
       return <p>{this.props.searchResultsNone}</p>
     }
  }

  handleGalleryOpen(e) {
    //updates the state with the objectId of the thumbNail that was chosen
    //and an array of the objectIds of all the other thumbNails so they can be sent to gallery component
    //and reveals the Gallery component
    const gallery = {
      firstArtIndex: e.currentTarget.id.slice(10),
      fileIds: this.props.fileIds.map(e => {
        return e.id
      }),
      open: true
    };

    this.setState({gallery}, () => {console.log('handleGalleryOpen ran and the updated state is:', this.state.gallery)});
  }

  handleGalleryExit(){
    //when user wants to exit the gallery
    //updates the state to hide the Gallery component
    const gallery = {
      open: false,
      firstArtIndex: '',
      fileIds: null
    }
    this.setState({gallery}, () => {console.log('handleGalleryExit ran and the updated state is:', this.state.gallery)});
  }

  renderGalleryState(result) {
    //determines whether to render Gallery component or hide it
    //dependent on whether user has clicked on a thumbnail
    if (this.state.gallery.open) {
      return (
        <Gallery
          firstArtIndex={this.state.gallery.firstArtIndex}
          fileIds={result.files}
          onExitClick={this.handleGalleryExit}
          alt={`file for ${result.title} by ${result.artist}`}
         />
      )
    } else {
      return null
    }
  }

  render(){
    console.log('calling render() for search-results');
    if(this.props.show) {
      return (
        <Fragment>
          <span
            className = {classnames('exit', 'exit-search-results')}
            onClick = {() => this.props.onExitClick()}
          >T
          </span>
          {this.renderResults()}
        </Fragment>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  searchResults: state.userContent.searchByKeyWordResults,
  searchResultsNone: state.userContent.searchByKeyWordResultsNone,
});

export default connect(mapStateToProps)(SearchResults);
