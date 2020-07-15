import React, {Fragment} from "react";
import {connect} from 'react-redux';
import * as d3 from 'd3';
import _ from 'underscore';

import ContentPreview from './content-preview';
import genCatColor from '../multi-side/gen-cat-color';
import './graph.css';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
//console.log('charge is', windowWidth/-6)
const force = d3.layout.force()
  .charge(windowWidth/-6)
  .linkDistance(() => 100)
  .linkStrength(() => .1)
  .size([windowWidth, windowHeight * 16/20])


export class TouchScreenGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodePreview: '',
      nodes: this.props.nodes,
      links: this.props.links,
    };
    force.nodes(this.state.nodes).links(this.state.links);
    force.start();
    this.handleNodeClick = this.handleNodeClick.bind(this);
  }

  componentWillMount() {
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    });
  }

  handleNodeClick(nodeIndex) {
    const newNpState = this.state.nodePreview? '' : nodeIndex;
    this.setState({nodePreview: newNpState});
  }

  renderPreviewState(node) {
    //determines whether to render Gallery component or hide it
    //dependent on whether user has clicked on a thumbnail
    // console.log(node);
    if (node.index === this.state.nodePreview) {
      return (
        <ContentPreview
          node={node}
        />
      )
    } else {
      return null
    }
  }

  renderNode(node, i, transform, color){
    const dimension = windowWidth/1280;
    //console.log('dimension is', dimension)
    return (
      <g
        className='node'
        id={`node-${node.index}`}
        key={i}
        transform={transform}
        fill={color}
        stroke={color}
        onClick={() => this.handleNodeClick(node.index)}
      >
      <rect width={`${dimension}em`} height={`${dimension}em`} x={`-${dimension/2}em`} y={`-${dimension/2}em`} />
      {this.renderPreviewState(node)}
    </g>
    )
  }

  render() {
    // use React to draw all the nodes, d3 calculates the x and y
    // console.log('render() happening and state is', this.state);
    var nodes = this.state.nodes.map((node, i) => {
      var transform = 'translate(' + node.x + ',' + node.y + ')';
      let color;
      if(node.category) {
        color = genCatColor(node.category);
      } else {
        color = 'black';
      }
      return this.renderNode(node, i, transform, color)
    });

    var links = _.map(this.state.links, (link) => {
      return (
        <line className='link' key={link.key}
          x1={link.source.x} x2={link.target.x} y1={link.source.y} y2={link.target.y} />
      );
    });

    return (
      <Fragment>
        <svg className='graph' viewBox={`0 0 ${windowWidth} ${windowHeight * 16/20}`}>
          <g>
            {links}
            {nodes}
          </g>
        </svg>
      </Fragment>
    );
  }
};

export default connect()(TouchScreenGraph);
