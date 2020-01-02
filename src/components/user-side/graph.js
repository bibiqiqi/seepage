import React, {Fragment} from "react";
import * as d3 from 'd3';
import _ from 'underscore';
import Color from 'color';

import Gallery from '../multi-side/gallery';
import ContentPreview from './content-preview';

var width = 800;
var height = 500;
var force = d3.layout.force()
  .charge(-200)
  .linkDistance(function(link){return link.distance})
  .linkStrength(function(link){return link.strength})
  .size([width, height]);

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodePreview: null,
      gallery: null,
      fileObjects: null
    };
    this.handleGalleryOpen = this.handleGalleryOpen.bind(this);
    this.handleGalleryExit = this.handleGalleryExit.bind(this);
    this.renderGalleryState = this.renderGalleryState.bind(this);
  }

  componentWillMount() {
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    });
  }

  componentWillReceiveProps(nextProps) {
    force.nodes(nextProps.nodes).links(nextProps.links);
    force.start();
  }

  translateAndBlendColors(categoryArray){
    const categoryLegend = {
      media: Color.rgb(255, 29, 55), //red
      performance: Color.rgb(255, 235, 29), //yellow
      text: Color.rgb(35, 213, 255) //blue
    };

    const colorArray = [];
    categoryArray.forEach(e => {
      for (let key in categoryLegend) {
        if (e === key) {
          colorArray.push(categoryLegend[key])
        }
      }
    });
    let newColor;
    if (colorArray.length > 1) {
      let blendedColor = colorArray[0];
      let i;
      for(i = 1; i < colorArray.length; i++) {
        blendedColor.mix(colorArray[i])
      }
      newColor = blendedColor;
    } else {
      newColor = colorArray[0];
    }
    return newColor;
  }

  renderPreviewState(node) {
    //determines whether to render Gallery component or hide it
    //dependent on whether user has clicked on a thumbnail
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

  handleGalleryOpen(e, node) {
    //updates the state with the objectId of the thumbNail that was chosen
    //and an array of the objectIds of all the other fileIds so they can be sent to gallery component
    //and reveals the Gallery component
    this.setState({
      gallery: parseInt(e.currentTarget.id.slice(5), 10),
      fileObjects: node.files //when gallery is clicked on by user, fileObjects is received from redux state
    }, () => {console.log('you opened the gallery and the new state of graph is', this.state)})
  }

  handleGalleryExit(){
    //when user wants to exit the gallery
    //updates the state to hide the Gallery component
    this.setState({gallery: null}
      // , () => {console.log('handleGalleryExit ran and the updated state is:', this.state.gallery)}
    );
  }

  renderGalleryState() {
    //determines whether to render Gallery component or hide it
    //dependent on whether use has clicked on a thumb nail
    if (this.state.gallery !== null) {
      return (
        <Gallery
          firstArtIndex="0"
          fileObjects={this.state.fileObjects} //bc this can be triggered by onMouseLeave, new render of Gallery receives fileObjects from internal state
          onExitClick={this.handleGalleryExit}
          alt={(fileNumber) => `Gallery view of file ${fileNumber} for ${this.props.nodes[this.state.gallery].title}, by ${this.props.nodes[this.state.gallery].artist}`}
         />
      )
    } else {
      return null
    }
  }

  render() {
    // use React to draw all the nodes, d3 calculates the x and y
    var nodes = _.map(this.props.nodes, (node, i) => {
      var transform = 'translate(' + node.x + ',' + node.y + ')';
      let color;
      if(node.category) {
        color = this.translateAndBlendColors(node.category);
      } else {
        color = "gray";
      }
      return (
        <g
          className='node'
          id={`node-${node.index}`}
          key={i}
          transform={transform}
          fill={color}
          stroke={color}
          onClick={(e) => this.handleGalleryOpen(e, node)}
          onMouseEnter={() => {
             this.setState({nodePreview: node.index}, () => console.log('new state is', this.state));
          }}
          onMouseLeave={() => {
             this.setState({nodePreview: null}, () => console.log('new state is', this.state));
          }}
        >
          <rect width='.5em' height='.5em' x='-.25em' y='-.25em' />
          {this.renderPreviewState(node)}
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
      <Fragment>
        {this.renderGalleryState()}
        <svg width={width} height={height}>
          <g>
            {links}
            {nodes}
          </g>
        </svg>
      </Fragment>
    );
  }
};
