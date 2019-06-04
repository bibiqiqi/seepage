import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';


import EditorFindForm from './find-form';
//import EditorFindResults from './find-results';
import {fetchContent} from '../../actions/content';
import Logo from '../logo';
import './find.css';

class EditorFindPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {
        wholeDiv: true,
        browse: true,
        search: true,
        media: true,
        text: true,
        performance: true
      },
      content: {
        allContent: '',
        filteredContent: '',
        loading: false,
        error: null,
    }
  }
  componentDidMount(){
    console.log('dispatching fetchContent()');
    this.fetchContent();
  }
  fetchContent() {
    this.setState(){
      error: null,
      loading: true
    }
  }
  render(){
    // const resultsArray = [];
    // resultsArray.forEach((e, i) => {
    //
    // })
    // let resultsClass = classNames({
    //   'results': true,
    //   'hidden': this.state.results.
    // });
    return (
      <section id="editor-find" className="pop-up">
        <Link to="/editor-home"><Logo/></Link>
        <main id="editor-browse-search">
          <span className="back">E</span>
          <EditorFindForm/>
        </main>
      </section>
    )
  }
}

 export default connect()(EditorFindPage);
