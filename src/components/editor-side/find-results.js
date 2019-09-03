import React from 'react';
import {connect} from 'react-redux';
import Collapsible from 'react-collapsible';
import {SubmissionError} from 'redux-form';

import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';

class EditorFindResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbNails: null,
      key: null,
      open: false,
      loading: false,
      error: null,
    }
    this.fetchThumbnails = this.fetchThumbnails.bind(this);
  }
  handleClick(contentId, key){
    //debugger;
    //if a user clicks a collapsible and one of them is open...
    if (this.state.open) {
      //test to see if the one that's open equals the one clicked
      if (key === this.state.key) {
        //if so, just update the state
        this.setState({
          error: null,
          open: false
        })
      } else { //if not, that means the user is trying to open a different collapsible
        //so, update the state and call fetchThumbnails for the new collapsible
        this.setState({
          error: null,
          key: key
        })
        this.fetchThumbnails(contentId);
      }
    //if user clicks a collapsible that's closed...
    } else {
      //test to see if the one that was clicked is equal to the thumbNails in state
      if (key === this.state.key) {
        this.setState({
          open: true
        })
      } else {
        //if it's not, fetch new thumbNails and update state
        this.setState({
          thumbNails: null,
          key: key,
          open: true,
          loading: true,
          error: null
      });
        this.fetchThumbnails(contentId);
     }
  };
}

  fetchThumbnails(contentId) {
    console.log("doing fetchThumbnails");
    return fetch(`${API_BASE_URL}/content/${contentId}`)
      .then(res => normalizeResponseErrors(res))
      .then(res => {
        debugger;
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                //test if the chunk is equal to the seperator that was put inside the
                //concatinated stream
                const string = decoder.decode(value);
                console.log(string);
                if (string === '\n') {
                  console.log('found a seperator!');
                }
                if (done) {
                  controller.close();
                  //reader.releaseLock();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          }
        })
      })
      .then(stream => new Response(stream))
      .then(response => response.blob())
      .then(blob => {
        debugger;
        URL.createObjectURL(blob)
      })
      .then(url => {
        return (
          this.setState({
            thumbNails: url,
            loading: false,
          })
        )
      })
      .catch(err => {
        this.setState({
          error: 'Could not retrieve thumbNails',
          loading: false
        })
        return Promise.reject(
          new SubmissionError({
            _error: err
          })
        );
      })
  }
  render(){
    //debugger
    let thumbNailState;
    if (this.state.loading){
      thumbNailState = <h3>loading</h3>;
    } else if (this.state.thumbNails) {
      //debugger;
      thumbNailState = <img src={this.state.thumbNails}/>
      //thumbNailstate = this.state.files.map((file, index) => {
      //thumbNailstate = <img key={index} src={file}/>
      //})
    } else if (this.state.error) {
      thumbNailState = <h3>sorry, there was an error retrieving the files</h3>
    };
    if ((!this.props.filteredContent) && (!this.props.filteredContentNone)) {
      return null;
    } else if (this.props.filteredContent) {
      const results = this.props.filteredContent.map((result, index) => {
        const tags = result.tags.map((tag, index) => <h4 key={index}>{tag}</h4>);
        return (
          <li key={index} className='result'>
            <Collapsible open={this.state.open && this.state.key===index}trigger={`${result.title} by ${result.artistName}`} handleTriggerClick={(e) => this.handleClick(result.id, index)}>
              {thumbNailState}
              <h3>{result.category}</h3>
              <h3>tags:</h3>
              {tags}
            </Collapsible>
          </li>
        )
      });
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
