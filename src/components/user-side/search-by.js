import {connect} from 'react-redux';
import React from 'react';

import {searchByKeyWord} from '../../actions/content/user-side';
import './search-by.css';

export class SearchBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '',
      searched: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    //console.log('handleChange happening');
    const value = e.target.value;
    const keyWord = value;
    this.setState({keyWord});
  }

  handleSubmit(){
    //console.log('handleSubmit happening');
    const keyWord = this.state.keyWord;
    this.props.dispatch(searchByKeyWord(keyWord))
      .then(this.props.onSubmit())
  }

  render(){
    return(
      <div
        className='user-search'
        >
          <input
            id="keyword-search"
            type="text"
            autoComplete="off"
            onChange={this.handleChange}
            onKeyPress={(e) => {if (e.key === "Enter") {
              this.handleSubmit();
            }}}
          />
          <input
            className = 'clickable'
            type="button"
            value="submit_keyword"
            onClick={this.handleSubmit}
          ></input>
      </div>
    )
  }
}

export default connect()(SearchBy);
