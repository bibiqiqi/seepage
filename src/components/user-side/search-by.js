import {connect} from 'react-redux';
import React from 'react';
import cloneDeep from 'clone-deep';

import {searchByKeyWord} from '../../actions/content/user-side';
import './search-by.css'

const initialState = {
  keyWord: ''
}

class SearchBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    //console.log('handleChange happening');
    const value = e.target.value;
    const keyWord = value;
    this.setState({keyWord}, () => {console.log('handleChange updated the state and now its:', this.state)});
  }

  handleSubmit(){
    //console.log('handleSubmit happening');
    const keyWord = this.state.keyWord;
    this.props.dispatch(searchByKeyWord(keyWord))
      .then(this.props.onSubmit())
  }

  render(){
    return(
      <section
        id="user-search"
        className="search-submit"
        >
        <input
          placeholder='search...'
          type="text"
          autoComplete="off"
          onChange={this.handleChange}
        />
        <button
          className="submit-button clickable"
          type="submit"
          onClick={this.handleSubmit}
        ></button>
      </section>
    )
  }
}

export default connect()(SearchBy);
