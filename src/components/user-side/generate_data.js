import _ from 'underscore';
import casual from 'casual-browserify';
// {/*randomData takes in nodes, width, height and returns:
//   {nodes, links}

function createTagPool(){
  let tagPool = [];
  let i;
  for (i = 0; i < 10; i++) {
    tagPool.push(casual.word);
  }
  _.uniq(tagPool);
  console.log('tag pool', tagPool);
  return tagPool;
}

function pickTags(tagPool){
  let tags = [];
  const randomNumber=_.random(1, 5);
  let i;
  for (i = 0; i < randomNumber; i++) {
   tags.push(tagPool[_.random(0, tagPool.length-1)]) ;
  }
  return tags;
}

function generateNodes() {
  const categories = [
    {
      color: "red",
      category: "performance"
    },
    {
      color: "blue",
      category: "text"
    },
    {
      color: "yellow",
      category: "media"
    }
  ];
  const tagPool = createTagPool();
  const nodes = [];
  const randomNumber= _.random(4, 10);
  console.log('number of nodes', randomNumber);
  let uniqKey = 100;
  let i;
  for (i = 0; i < randomNumber; i++) {
    const type = categories[_.random(0, 2)];
    nodes[i] = {
      index: i,
      key: uniqKey++,
      name: casual.full_name,
      title: casual.title,
      color: type.color,
      category: type.category,
      tags: _.uniq(_.sortBy(pickTags(tagPool)), true)
    };
 }
 console.log('nodes', nodes);
 return nodes;
}

export default function generateData(width, height) {
  const nodes = generateNodes();
  const links = [];
  let l = 0; //iterator for links indexes;

  //iterate through each node in the nodes array
    nodes.forEach(function(sourceNode, s){
  //iterate through each tag in the current node for comparing as source to other arrays as targets
      sourceNode.tags.forEach(function(sourceTag){
  //iterate through elements in the nodes array that are not equal to the source node
  //to find target nodes that contain the same tags
        nodes.forEach(function(targetNode, t){
  //if target node doesn't equal source node and it contains the current source tag, and
  //there is no link for this pair of nodes yet, create a link element
          let link = links.find(function(link) {
            return (link.key === `${sourceNode.key}, ${targetNode.key}`) || link.key === `${targetNode.key}, ${sourceNode.key}`
          });

          if (t!=s && _.contains(nodes[t].tags, sourceTag) && link !== undefined) {
            //links[link.index].strength = (links[link.index].strength) + .1;
            links[link.index].distance = (links[link.index].distance) / 2;
          }
          else if (t!=s && _.contains(nodes[t].tags, sourceTag)) {
            links.push({index: l, source: sourceNode.index, target: targetNode.index , key: `${sourceNode.key}, ${targetNode.key}`, strength: .10, distance: 400 });
            l++;
          }
        }) //loop for iterating through target nodes
      }) //loop for iterating through tags in the source node
    }) //loop for iterating through source nodes
  console.log('links', links);
  // maintainNodePositions(oldNodes, nodes, width, height);
  return {nodes, links}
}

// {/*
// export default function randomData(nodes, width, height) {
//   var oldNodes = nodes;
//   nodes = _.chain(_.range(_.random(1, 30)))
//     .map(function() {
//       var node = {};
//       node.key = _.random(0, 30);
//       node.size = _.random(4, 10);
//       return node;
//     }).uniq(function(node) {
//       return node.key;
//     }).value();
//
//   if (oldNodes) {
//     var add = _.initial(oldNodes, _.random(0, oldNodes.length));
//     add = _.rest(add, _.random(0, add.length));
//
//     nodes = _.chain(nodes)
//       .union(add).uniq(function(node) {
//         return node.key;
//       }).value();
//   }
//
//   let links = _.chain(_.range(_.random(15, 35)))
//     .map(function() {
//       var link = {};
//       link.source = _.random(0, nodes.length - 1);
//       link.target = _.random(0, nodes.length - 1);
//       link.key = link.source + ',' + link.target;
//       link.size = _.random(1, 3);
//       return link;
//     }).uniq((link) => link.key)
//     .value();
//
//   maintainNodePositions(oldNodes, nodes, width, height);
//   return {nodes, links};
// }
//
// function maintainNodePositions(oldNodes, nodes, width, height) {
//   var kv = {};
//   _.each(oldNodes, function(d) {
//     kv[d.key] = d;
//   });
//   _.each(nodes, function(d) {
//     if (kv[d.key]) {
//       // if the node already exists, maintain current position
//       d.x = kv[d.key].x;
//       d.y = kv[d.key].y;
//     } else {
//       // else assign it a random position near the center
//       d.x = width / 2 + _.random(-150, 150);
//       d.y = height / 2 + _.random(-25, 25);
//     }
//   });
// }
