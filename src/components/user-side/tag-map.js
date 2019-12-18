import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import Graph from './graph';
import './tag-map.css';

class TagMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      links: [],
      nodes: []
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.allContent !== this.props.allContent) {
      this.generatePrimaryNodes(this.props.allContent).then(nodeArrays => {
        this.generateLinks(nodeArrays);
      })
    }
  }

  generatePrimaryNodes(secondaryNodes){
    return new Promise(function(resolve, reject) {
      const primaryNodes = [];
      const simplePrimeNodes = [];
      let x = secondaryNodes.length;
      //iterate through each node in the nodes array
        secondaryNodes.forEach(function(secondaryNode, i){
          //iterate through each node to add key/value pare that identifies it as a secondary node
          secondaryNode.type = 'secondary';
          secondaryNode.index = i;
          secondaryNode.tags.forEach(function(tag){
            if (!_.contains(simplePrimeNodes, tag.toLowerCase())) {
              const primaryNode = {
                type: 'primary',
                tag: tag.toLowerCase(),
                index: x
              };
              simplePrimeNodes.push(tag.toLowerCase());
              primaryNodes.push(primaryNode);
              x++;
            }
          })
       })
       const nodeArrays = {
         primaryNodes: primaryNodes,
         secondaryNodes: secondaryNodes
       }
      resolve(nodeArrays);
    })
  }

  generateLinks(nodeArrays) {
    const {primaryNodes, secondaryNodes} = nodeArrays;
    const links = [];
    let l = 0; //iterator for links indexes;
    //iterate through each node in the nodes array
      primaryNodes.forEach(function(primaryNode, i){
        secondaryNodes.forEach(function(secondaryNode, n){
          secondaryNode.tags.forEach(function(tag){
            if(tag.toLowerCase() === primaryNode.tag){
              links.push({index: l, source: primaryNode.index, target: secondaryNode.index , key: `${primaryNode.index}, ${secondaryNode.index}`, strength: .10, distance: 100 });
              l++;
            }
          })
        })
      })
    const nodes = primaryNodes.concat(secondaryNodes);
    this.setState({links, nodes});
  }

  render() {
    return (
      <div id="tag-map">
        <Graph nodes={this.state.nodes} links={this.state.links} />
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  allContent: state.userContent.allContent,
})

export default connect(mapStateToProps)(TagMap);
