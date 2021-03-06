import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import LargeScreenGraph from './largescreen-graph';
import TouchScreenGraph from './touchscreen-graph';

export class BrowseBy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      links: [],
      nodes: []
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.allContent !== this.props.allContent) {
      // console.log('passing', this.props.allContent, 'to generatePrimaryNodes');
      this.generatePrimaryNodes(this.props.allContent).then(nodeArrays => {
        //console.log('passing', nodeArrays, 'to generateLinks');
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
    // console.log('generateLinks running')
    const {primaryNodes, secondaryNodes} = nodeArrays;
    //console.log(primaryNodes, secondaryNodes);
    const links = [];
    let l = 0; //iterator for links indexes;
    //iterate through each node in the nodes array
      primaryNodes.forEach(function(primaryNode, i){
        secondaryNodes.forEach(function(secondaryNode, n){
          secondaryNode.tags.forEach(function(tag){
            if(tag.toLowerCase() === primaryNode.tag){
              links.push({index: l, source: primaryNode.index, target: secondaryNode.index, key: `${primaryNode.index}, ${secondaryNode.index}`});
              l++;
            }
          })
        })
      });
    const nodes = secondaryNodes.concat(primaryNodes);
    // console.log('updating state with', nodes);
    this.setState({links});
    this.setState({nodes});
  }

  render() {
    // console.log('passing', this.state.nodes, 'to graph component');
    // console.log('passing', this.state.links, 'to graph component');
    const {links, nodes} = this.state;
    if(links.length && nodes.length) {
      if (window.innerWidth >= 992) {
        return (
          <div className="user-browse">
            <LargeScreenGraph nodes={nodes} links={links} />
          </div>
        )
      } else {
        return (
          <div className="user-browse">
            <TouchScreenGraph nodes={nodes} links={links} />
          </div>
        )
      }
    } else {
      return null
    }
  }
};

const mapStateToProps = (state) => ({
  allContent: state.userContent.allContent,
})

export default connect(mapStateToProps)(BrowseBy);
