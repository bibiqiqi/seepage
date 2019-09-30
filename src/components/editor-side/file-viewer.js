import React from 'react';
import {connect} from 'react-redux';

export default class EditorFileViewer extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return <img src={this.props.url} height='500' width='500'/>
  }
}
