import React, {Fragment} from "react";
import {connect} from 'react-redux';
import * as d3 from 'd3';
import _ from 'underscore';
import cloneDeep from 'clone-deep';

import ContentPreview from './content-preview';
import genCatColor from '../multi-side/gen-cat-color';
import './graph.css';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const force = d3.layout.force()
  .charge(-200)
  .linkDistance(function(link){return link.distance})
  .linkStrength(function(link){return link.strength})
  .size([windowWidth, windowHeight])


class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodePreview: '',
      nodes: cloneDeep(this.props.nodes),
      links: cloneDeep(this.props.links)
    };
    force.nodes(this.state.nodes).links(this.state.links);
    force.start();
  }

  componentWillMount() {
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    });
  }

  renderPreviewState(node) {
    //determines whether to render Gallery component or hide it
    //dependent on whether user has clicked on a thumbnail
    if (node.index === this.state.nodePreview) {
      return (
        <ContentPreview
          node={node}
          onExitClick={() => {
            this.setState({nodePreview: ''});
          }}
        />
      )
    } else {
      return null
    }
  }

  renderNodeForTouchScreen(node, i, transform, color){
    return (
      <g
        className='node'
        id={`node-${node.index}`}
        key={i}
        transform={transform}
        fill={color}
        stroke={color}
        onClick={() => {
          const newNPState = this.state.nodePreview? '' : node.index;
          this.setState({nodePreview: newNPState});
        }}
      >
      <rect width='.5em' height='.5em' x='-.25em' y='-.25em' />
      {this.renderPreviewState(node)}
    </g>
    )
  }

  renderNodeForLargeScreen(node, i, transform, color){
    return (
      <g
        className='node'
        id={`node-${node.index}`}
        key={i}
        transform={transform}
        fill={color}
        stroke={color}
        onMouseEnter={() => {
           this.setState({nodePreview: node.index});
        }}
        onMouseLeave={() => {
           this.setState({nodePreview: null});
        }}
      >
      <rect width='.5em' height='.5em' x='-.25em' y='-.25em' />
      {this.renderPreviewState(node)}
    </g>
    )
  }

  render() {
    // use React to draw all the nodes, d3 calculates the x and y
    //console.log('render() happening and state is', this.state);
    var nodes = this.state.nodes.map((node, i) => {
      var transform = 'translate(' + node.x + ',' + node.y + ')';
      let color;
      if(node.category) {
        color = genCatColor(node.category);
      } else {
        color = 'black';
      }

      if (windowWidth >= 992) {
        return this.renderNodeForLargeScreen(node, i, transform, color)
      } else {
        return this.renderNodeForTouchScreen(node, i, transform, color)
      }

    });

    var links = _.map(this.state.links, (link) => {
      return (
        <line className='link' key={link.key}
          x1={link.source.x} x2={link.target.x} y1={link.source.y} y2={link.target.y} />
      );
    });

    return (
      <Fragment>
        <svg className='graph' viewBox={`0 0 ${windowWidth} ${windowHeight * 4/5}`}>
          <g>
            {links}
            {nodes}
          </g>
        </svg>
      </Fragment>
    );
  }
};

export default connect()(Graph);
