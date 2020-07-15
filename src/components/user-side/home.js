import {connect} from 'react-redux';
import React from 'react';

import Logo from '../multi-side/logo';
import Gallery from '../multi-side/gallery';
import BrowseBy from './browse-by';
import SearchResults from './search-results';
import Navigation from './navigation';
import './home.css';
import {fetchContent, closeGallery} from '../../actions/content/multi-side';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBy: {
        artistName: '',
        title: '',
        tag: ''
      },
      searchResults: {
        show: false,
        submits: 0
      }
    }
    this.handleExitSearchResults = this.handleExitSearchResults.bind(this);
    this.handleGalleryExit = this.handleGalleryExit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount(){
    //console.log('doing componentDidMount');
    //updates the Redux state with current content in DB and map suggestedArtists
    //suggestedTitles, and suggestedTags to local state
    this.props.dispatch(fetchContent("user"));
  }

  handleExitSearchResults(){
    const searchResults = {
      show: false,
      submits: 0
    };
    this.setState({searchResults});
  }

  handleGalleryExit(){
    //when user wants to exit the gallery
    //updates the state to hide the Gallery component
    this.props.dispatch(closeGallery());
  }

  handleSearch(){
    const searchResults = Object.assign({}, this.state.searchResults);
    searchResults.show = true;
    ++searchResults.submits;
    this.setState({searchResults});
  }

  renderGalleryState() {
    //determines whether to render Gallery component or hide it
    //dependent on whether use has clicked on a thumb nail
    if (this.props.galleryFiles.length) {
      return (
        <Gallery
          firstArtIndex={this.props.galleryStarting}
          fileObjects={this.props.galleryFiles} //bc this can be triggered by onMouseLeave, new render of Gallery receives fileObjects from internal state
          onExitClick={this.handleGalleryExit}
          alt={(currentArtIndex) => `Gallery view of file ${currentArtIndex} for ${this.props.galleryFiles[currentArtIndex].title}, by ${this.props.galleryFiles[currentArtIndex].artist}`}
         />
      )
    } else {
      return null
    }
  }

  renderHomeContainer() {
    if (window.innerWidth >= 992) {
      return (
        <div className='large-home-container'>
          <Navigation
            onSearch={this.handleSearch}
          />
          <BrowseBy/>
        </div>
      )
    } else {
      return (
        <div className='small-home-container'>
          <Navigation
            onSearch={this.handleSearch}
          />
          <BrowseBy/>
        </div>
      )
    }
  }

  render(){
    return (
      <section id="user-home" className="screen">
      {this.renderGalleryState()}
        <Logo/>
        <SearchResults  //pushes tagMap down with results when user searches. user can minimize after opening
          show={this.state.searchResults.show}
          submits={this.state.searchResults.submits}
          onExitClick={this.handleExitSearchResults}
        />
        {this.renderHomeContainer()}
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.userContent.loading,
  error: state.userContent.error,
  galleryFiles: state.userContent.galleryFiles,
  galleryStarting: state.userContent.galleryStarting
})

export default connect(mapStateToProps)(Home);
