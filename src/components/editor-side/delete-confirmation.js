import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {editContentInState} from '../../actions/content/editor-side';

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
    toast('loading');
    this.setState({loading: true, success: null});
    return fetch(`${API_BASE_URL}/protected/content/${this.props.contentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      }
    })
      .then(res => normalizeResponseErrors(res))
      .then(deletedDoc => {
        toast.dismiss();
        toast('success!');
        const asyncCall = {loading: false, success: true};
        this.setState({asyncCall});
        this.props.dispatch(editContentInState(this.props.contentId))
          .then(() => this.props.onDeleteConfirm())

      })
      .catch(err => {
        toast.dismiss();
        toast.error('there was an error updating the content');
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
     if ((!(this.state.asyncCall.loading)) && (this.state.asyncCall.success === null)) {
       return (
         <div
         className="pop-up"
         >
           {this.renderRemoveSymbol()}
           <h3>Are You Sure You Want to Erase This Content?</h3>
           <button
             onClick={this.deleteEntry}
           >
             Yes
           </button>
         </div>
       )
     }
   }

   render(){
     return this.renderDeleteState();
   }
}

const mapStateToProps = state => ({
  authToken: state.auth.authToken,
});

export default connect(mapStateToProps)(DeleteConfirmation);
