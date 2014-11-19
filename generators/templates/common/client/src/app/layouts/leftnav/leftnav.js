define(['common/utils/tree'], function(TreeUtil) {
  var diName = 'LeftNavCtrl';
  return {
    __register__: function(mod) {
      mod.controller(diName, ['$rootScope', '$scope', '$state', '$location', 'session', LeftNavCtrl]);
      return mod;
    }
  };

  function LeftNavCtrl($rootScope, $scope, $state, $location, session) {
    $scope.navData = null;
    $scope.treeStatus = {
      currentNode: null,
      expandedNodes: []
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if($location.search().popup){//if url has popup parameter, do not render leftnav
        return;
      }
      var state = toState.name.split('.'),
        navData = $scope.navData = session.navData,
        selectedNode;

      state[state.length-1] = state[state.length-1].replace(/add-|edit-/, '');
      state = state.join('.');
      selectedNode = _findNavNode(navData, state);
      if (selectedNode) {
        $scope.treeStatus.currentNode = selectedNode;
        $scope.treeStatus.expandedNodes = TreeUtil.getExpandedNodes(navData, [selectedNode], 'items');
      }
    });
    $scope.treeOptions = {
      nodeChildren: "items",
      dirSelectable: false,
      addAttr: function(node){
        return node.state || '';
      }
    };
    $scope.selectable = function(node) {
      return !!node.state;
    };
    $scope.onSelected = function(node) {
      $state.go(node.state);
    };
  }

  function _findNavNode(navData, state) {
    if (!navData || !navData.length || !state) {return null};
    var node = null,
      i, len = navData.length;
    for (i = 0; i < len; i++) {
      node = navData[i];
      if (node.state == state) {
        break;
      } else {
        node = _findNavNode(node.items, state);
        if (node) {
          break;
        }
      }
      node = null;
    }
    return node;
  }
});