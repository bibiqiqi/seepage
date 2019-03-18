import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import _ from 'underscore';

var width = 800;
var height = 370;
var force = d3.layout.force()
  .charge(-300)
  .linkDistance(function(link){return link.distance})
  //.linkStrength(function(link){return link.strength})
  .size([width, height]);

export default class Graph extends React.Component {
  componentWillMount() {
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    });
  }

  componentWillReceiveProps(nextProps) {
    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
    force.nodes(nextProps.nodes).links(nextProps.links);

    force.start();
  }
  render() {
    //onHover(e) {
    //this.props.dispatch(showText())
    //}
    //onHoverLeave(e) {
    //this.props.dispatch(hideText())
    //}
    // use React to draw all the nodes, d3 calculates the x and y
    var nodes = _.map(this.props.nodes, (node) => {
      var transform = 'translate(' + node.x + ',' + node.y + ')';
      return (
        <g className='node' key={node.key} transform={transform} fill={node.color} stroke={node.color} >
          <rect width='.5em' height='.5em' x='-.25em' y='-.25em' />
          <div className= "hidden nodeText"
          //  onMouseEnter={this.hoverOn}
          //  onMouseLeave={this.hoverOff}
          >
            <text dy='.35em' dx='.5em'>{node.title}</text>
            <text dy='-.5em' dx='.5em'>{node.name}</text>
          </div>

        </g>
      );
    });
    var links = _.map(this.props.links, (link) => {
      return (
        <line className='link' key={link.key}
          x1={link.source.x} x2={link.target.x} y1={link.source.y} y2={link.target.y} />
      );
    });

    return (
      <svg width={width} height={height}>
        <g>
          {links}
          {nodes}
        </g>
      </svg>
    );
  }
};
