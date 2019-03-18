import React from 'react';
import ReactDOM from 'react-dom';

import Graph from './graph';
import generateData from './generate_data';
import './tag-map.css';

export default class TagMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  updateData() {
    var width = 800;
    var height = 370;
    // randomData is loaded in from external file generate_data.js
    // and returns an object with nodes and links
    var newState = generateData(width, height);
    this.setState(newState);
    console.log(newState);
  }

  render() {
    return (
      <div id="tag-map">
        <Graph nodes={this.state.nodes} links={this.state.links} />
      </div>
    );
  }
};
