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

//performs async DELETE request
//props passed from EditorFindResults are:
  // contentId={this.state.contentId}
  // onDeleteExit={(e) => this.handleDeleteClick(e)}
  // index={index}
  // onDeleteConfirm={(e) => this.handleDeleteConfirm(e)}

class DeleteConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.deleteContent = this.deleteContent.bind(this);
    this.renderRemoveSymbol = this.renderRemoveSymbol.bind(this);
    this.renderDeleteState = this.renderDeleteState.bind(this);
  }

  deleteContent() {
    const asyncCall = {loading: true, success: null}
    this.setState({asyncCall});
    return fetch(`${API_BASE_URL}/protected/content/${this.props.contentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      }
    })
      .then(res => normalizeResponseErrors(res))
      .then(res => {
        console.log('delete was a success', res);
        //debugger;
        asyncCall.loading = false;
        asyncCall.success = true;
        this.setState({asyncCall});
        this.props.dispatch(editContentInState(this.props.contentId))
          .then(() => this.props.onDeleteConfirm())

      })
      .catch(err => {
        asyncCall.loading = false;
        asyncCall.success = false;
        this.setState({asyncCall});
      })
  };

  renderRemoveSymbol() {
    //console.log('value being passed to renderDeleteSymbol is', value);
     return(
       <span
         className = {classnames('exit', 'float-right', `delete-${this.props.index}`)}
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
             onClick={this.deleteContent}
           >
             Yes
           </button>
         </div>
       )
     } else if (this.state.asyncCall.loading) {
       return toast('loading');
     } else if (this.state.asyncCall.success) {
       return (
         toast.dismiss(),
         toast('success!')
       )
     } else if (this.state.asyncCall.success === false ) {
       return (
         toast.dismiss(),
         toast.error('there was an error updating the content')
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
