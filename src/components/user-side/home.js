import {connect} from 'react-redux';
import cloneDeep from 'clone-deep';

import React from 'react';
import Logo from '../multi-side/logo';
import TagMap from './tag-map';
import SearchBy from './search-by'
import SearchResults from './search-results'

import {fetchContent} from '../../actions/content/multi-side'
import './home.css';

const initialState = {
  searchBy: {
    artistName: '',
    title: '',
    tag: ''
  },
  searchResults: {
    show: false,
    submits: 0
  },
  preview: false,
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleExitSearchResults = this.handleExitSearchResults.bind(this);
  }

  componentDidMount(){
    console.log('doing componentDidMount');
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

  render(){
    return (
      <section id="user-home" className="page">
        <Logo/>
        <main>
        <div
          id="user-search"
        >
          <SearchBy
            onSubmit={() => {
              const searchResults = cloneDeep(this.state.searchResults);
              searchResults.show = true;
              ++searchResults.submits;
              this.setState({searchResults});
            }}
          />
          <SearchResults  //pushes tagMap down with results when user searches. user can minimize after opening
            show={this.state.searchResults.show}
            submits={this.state.searchResults.submits}
            onExitClick={this.handleExitSearchResults}
          />
        </div>
        <div
          id="user-browse"
        >
          <TagMap
          />
        </div>
        </main>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.userContent.loading,
  error: state.userContent.error,
  searchResults: state.userContent.searchByKeyWordResults,
  searchResultsNone: state.userContent.searchByKeyWordResultsNone,
  browseResults: state.userContent.browseByMap,
})

export default connect(mapStateToProps)(Home);
