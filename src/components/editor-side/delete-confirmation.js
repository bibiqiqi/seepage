import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';
import {editContentInState} from '../../actions/content/editor-side';
import {renderAsyncState} from '../multi-side/user-feedback.js'

import './delete-confirmation.css';

const initialState = {
  asyncCall: {
    loading: false,
    success: null
  }
}

//performs DELETE request
class DeleteConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.renderRemoveSymbol = this.renderRemoveSymbol.bind(this);
    this.renderDeleteState = this.renderDeleteState.bind(this);
  }

  deleteEntry() {
    const asyncCall = {loading: true, success: null}
    this.setState({asyncCall});
    return fetch(`${API_BASE_URL}/protected/content/${this.props.contentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      }
    })
      .then(res => normalizeResponseErrors(res))
      .then(deletedDoc => {
        const asyncCall = {loading: false, success: true};
        this.setState({asyncCall});
        this.props.dispatch(editContentInState(this.props.contentId))
          .then(() => this.props.onDeleteConfirm())
      })
      .catch(err => {
        const asyncCall = {loading: false, success: false};
        this.setState({asyncCall});
      })
  };

  renderRemoveSymbol() {
    //console.log('value being passed to renderDeleteSymbol is', value);
     return(
       <span
         className = {classnames('clickable', 'exit', 'float-right', `delete-${this.props.index}`)}
         onClick = {(e) => this.props.onDeleteExit(e)}
       >T</span>
     )
   }

   renderDeleteState() {
     return (
       <div className="delete-confirmation">
       <h3>Are You Sure You Want to Erase This Content?</h3>
        <div className='delete-confirm-flex'>
           <button onClick={this.deleteEntry}>
            Yes
           </button>
           <button onClick={this.props.onDeleteExit}>
              No
           </button>
        </div>
        {renderAsyncState(this.state.asyncCall, 'deletion')}
       </div>
     )
   }

   render(){
     return this.renderDeleteState();
   }
}

const mapStateToProps = state => ({
  authToken: state.auth.authToken,
});

export default connect(mapStateToProps)(DeleteConfirmation);
