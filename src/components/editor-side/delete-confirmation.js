import React from 'react';
import {connect} from 'react-redux';
import * as classnames from 'classnames';
import cloneDeep from 'clone-deep';
import {API_BASE_URL} from '../../config';
import {normalizeResponseErrors} from '../../actions/utils';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {editFilteredContent, fetchContent} from '../../actions/content';

const initialState = {
  ajax: {
    loading: false,
    success: null
  }
}

class DeleteConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(initialState);
    this.deleteContent = this.deleteContent.bind(this);
    this.renderRemoveSymbol = this.renderRemoveSymbol.bind(this);
    this.renderDeleteState = this.renderDeleteState.bind(this);
  }

  deleteContent() {
    //debugger;
    const ajax = {loading: true, success: null}
    this.setState({ajax});
    return fetch(`${API_BASE_URL}/protected/content/${this.props.contentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      }
    })
      .then(res => normalizeResponseErrors(res))
      .then(res => {
        console.log('delete was a success', res);
        ajax.loading = false;
        ajax.success = true;
        this.setState({ajax});
        //debugger;
        this.props.onDeleteConfirm();
        this.props.dispatch(editFilteredContent(this.props.contentId));
      })
      .catch(err => {
        ajax.loading = false;
        ajax.success = false;
        this.setState({ajax});
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
     debugger;
     if ((!(this.state.ajax.loading)) && (this.state.ajax.success === null)) {
       return (
         <div
         className="pop-up"
         >
           {this.renderRemoveSymbol()}
           <h3>Are You Sure You Want to Erase This Content?</h3>
           <button
             onClick={this.deleteContent()}
           >
             Yes
           </button>
         </div>
       )
     } else if (this.state.ajax.loading) {
       return toast('loading');
     } else if (this.state.ajax.success) {
       return (
         toast.dismiss(),
         toast('success!')
       )
     } else if (this.state.ajax.success === false ) {
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
