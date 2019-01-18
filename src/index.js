import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _ from 'underscore';
import randomData from './generate_data';
import * as d3 from 'd3';
import registerServiceWorker from './registerServiceWorker';

var width = 960;
var height = 500;
var force = d3.layout.force()
  .charge(-300)
  .linkDistance(50)
  .size([width, height]);

class Graph extends React.Component {
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
    // use React to draw all the nodes, d3 calculates the x and y
    var nodes = _.map(this.props.nodes, (node) => {
      var transform = 'translate(' + node.x + ',' + node.y + ')';
      return (
        <g className='node' key={node.key} transform={transform}>
          <rect width='.5em' height='.5em' x='-.25em' y='-.25em' />
          <text x={node.size + 5} dy='.35em'>{node.key}</text>
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

class App extends React.Component {
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
    // randomData is loaded in from external file generate_data.js
    // and returns an object with nodes and links
    var newState = randomData(this.state.nodes, width, height);
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <div className="update" onClick={this.updateData}>update</div>
        <Graph nodes={this.state.nodes} links={this.state.links} />
      </div>
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
registerServiceWorker();
