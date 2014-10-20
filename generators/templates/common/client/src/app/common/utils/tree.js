define(function() {
  //tree helpers
  var toString = Object.prototype.toString;

  function _setpush(arr, elm) {
    if (arr && arr.indexOf && arr.indexOf(elm) === -1) {
      arr.push(elm);
    }
    return arr;
  }

  function _getBranchNodes(rootNode, node, childrenPropertyName) {
    if(!rootNode) return null;
    if (rootNode === node) return [rootNode];
    var children = rootNode[childrenPropertyName],
      i, len, childBranch = null;
    if (children && (len = children.length) > 0) {
      for (i = 0; i < len; i++) {
        childBranch = _getBranchNodes(children[i], node, childrenPropertyName);
        if (childBranch && childBranch.length > 0) {
          childBranch.unshift(rootNode);
          break;
        }
      }
      return childBranch;
    } else {
      return null;
    }
  }

  function _getExpandedNodes(treeNodes, nodesToShow, childrenPropertyName) {
    if(!treeNodes || !treeNodes.length) return [];
    var expandedNodes = [];
    treeNodes.forEach(function(tnode) {
      nodesToShow.forEach(function(nodeToShow) {
        var branchNodes = _getBranchNodes(tnode, nodeToShow, childrenPropertyName);
        if (branchNodes && branchNodes.length > 0) {
          branchNodes.forEach(function(nodeForPush) {
            _setpush(expandedNodes, nodeForPush);
          });
        }
      });
    });
    return expandedNodes;
  }

  function _getAllNodes(treeNodes, childrenPropertyName) {
    if(!treeNodes || !treeNodes.length) return [];
    var nodes = [];
    treeNodes.forEach(function(tnode) {
      nodes.push(tnode);
      var children = tnode[childrenPropertyName];
      if (children && children.length > 0) nodes.push.apply(nodes, _getAllNodes(children, childrenPropertyName));
    });
    return nodes;
  }

  function processNodes(treeNodes, childrenPropertyName, processor) {
    if(!treeNodes || !treeNodes.length) return treeNodes;
    treeNodes.forEach(function(tnode) {
      processor(tnode);
      var children = tnode[childrenPropertyName];
      if (children && children.length > 0) {
        processNodes(children,childrenPropertyName, processor);
      }
    });
    return treeNodes;
  }
  return {
    getExpandedNodes: _getExpandedNodes,
    getAllNodes: _getAllNodes,
    processNodes: processNodes
  };
});