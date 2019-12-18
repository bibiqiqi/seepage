import React from 'react';
import {connect} from 'react-redux';
import cloneDeep from 'clone-deep';

import {searchByKeyWord} from '../../actions/content/user-side';
import LabeledInput from '../multi-side/labeled-input-controlled'

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
        >
        <LabeledInput
          name="keyWord"
          type="text"
          value={this.state.keyWord}
          label="Key Word"
          onChange={this.handleChange}
          noValidate
        />
        <button
          className="submit-search"
          id="searchSubmit"
          type="submit"
          onClick={this.handleSubmit}
        >Submit
        </button>
      </section>
    )
  }
}

export default connect()(SearchBy);
