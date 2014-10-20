define(function() {
  'use strict';
  var diName = 'ccTree';
  return {
    __register__: function(mod) {
      mod.directive(diName, ['$compile', ccTree]).directive('treeitem', [treeitem]).directive('treeTransclude', [treeTransclude]);
      return mod;
    }
  };
  //helpers
  /**
   * @param cssClass - the css class
   * @param addClassProperty - should we wrap the class name with class=""
   */
  function classIfDefined(cssClass, addClassProperty) {
    if (cssClass) {
      if (addClassProperty) return 'class="' + cssClass + '"';
      else return cssClass;
    } else return "";
  }

  function ensureDefault(obj, prop, value) {
    if (!obj.hasOwnProperty(prop)) obj[prop] = value;
  }

  function _invokeFn(fn, context) {
    var args = [].slice.call(arguments, 2);
    if (fn && fn.apply) {
      return fn.apply(context, args);
    }
    return undefined;
  }

  function ccTree($compile) {
    return {
      restrict: 'EA',
      require: "ccTree",
      transclude: true,
      scope: {
        treeModel: "=",
        selectedNode: "=?",
        expandedNodes: "=?",
        onSelection: "&",
        selectableFn: '&',
        onNodeToggle: "&",
        options: "=?",
        filterValue: "@?",
        orderBy: "@",
        reverseOrder: "@"
      },
      controller: ['$scope',
        function($scope) {
          $scope.filterItem = function(item) {
            if (!$scope.filterValue || !$scope.options.filterName) return true;
            var filterValue = $scope.filterValue.toLowerCase(),
              currentValue = item[$scope.options.filterName].toLowerCase();
            // console.log(currentValue,filterValue);
            var found = (item[$scope.options.filterName].toLowerCase().indexOf($scope.filterValue.toLowerCase()) !== -1);
            // console.log(found);
            if (!found) {
              angular.forEach(item[$scope.options.nodeChildren], function(item) {
                var match = $scope.filterItem(item);
                if (match) {
                  found = true;
                }
              });
            }
            // console.log(found);
            return found;
          }

          function defaultIsLeaf(node) {
            return !node[$scope.options.nodeChildren] || node[$scope.options.nodeChildren].length === 0;
          }

          function defaultEquality(a, b) {
            if (a == null || b == null) return false;
            a = angular.copy(a);
            a[$scope.options.nodeChildren] = [];
            b = angular.copy(b);
            b[$scope.options.nodeChildren] = [];
            return angular.equals(a, b);
          }
          $scope.options = $scope.options || {};
          //default options
          ensureDefault($scope.options, "nodeChildren", "children");
          ensureDefault($scope.options, "dirSelectable", false);
          ensureDefault($scope.options, "expandWhenSelected", true);
          ensureDefault($scope.options, "addAttr", function(){return ''});
          // ensureDefault($scope.options, "selectable", function(){return true;});
          ensureDefault($scope.options, "injectClasses", {});
          ensureDefault($scope.options.injectClasses, "ul", "");
          ensureDefault($scope.options.injectClasses, "li", "");
          ensureDefault($scope.options.injectClasses, "liSelected", "");
          ensureDefault($scope.options.injectClasses, "iExpanded", "");
          ensureDefault($scope.options.injectClasses, "iCollapsed", "");
          ensureDefault($scope.options.injectClasses, "iLeaf", "");
          ensureDefault($scope.options.injectClasses, "label", "");
          ensureDefault($scope.options.injectClasses, "labelSelected", "");
          ensureDefault($scope.options, "equality", defaultEquality);
          ensureDefault($scope.options, "isLeaf", defaultIsLeaf);
          $scope.expandedNodes = $scope.expandedNodes || [];
          $scope.expandedNodesMap = {};
          for (var i = 0; i < $scope.expandedNodes.length; i++) {
            $scope.expandedNodesMap["" + i] = $scope.expandedNodes[i];
          }
          $scope.parentScopeOfTree = $scope.$parent;
          $scope.headClass = function(node) {
            var liSelectionClass = classIfDefined($scope.options.injectClasses.liSelected, false);
            var injectSelectionClass = "";
            if (liSelectionClass && (this.node == $scope.selectedNode)) injectSelectionClass = " " + liSelectionClass;
            if ($scope.options.isLeaf(node)) return "tree-leaf" + injectSelectionClass;
            if ($scope.expandedNodesMap[this.$id]) return "tree-expanded" + injectSelectionClass;
            else return "tree-collapsed" + injectSelectionClass;
          };
          $scope.iBranchClass = function() {
            if ($scope.expandedNodesMap[this.$id]) return classIfDefined($scope.options.injectClasses.iExpanded);
            else return classIfDefined($scope.options.injectClasses.iCollapsed);
          };
          $scope.nodeExpanded = function() {
            return !!$scope.expandedNodesMap[this.$id];
          };
          $scope.selectNodeHead = function() {
            var expanding = $scope.expandedNodesMap[this.$id] === undefined;
            $scope.expandedNodesMap[this.$id] = (expanding ? this.node : undefined);
            if (expanding) {
              $scope.expandedNodes.push(this.node);
            } else {
              var index;
              for (var i = 0;
                (i < $scope.expandedNodes.length) && !index; i++) {
                if ($scope.options.equality($scope.expandedNodes[i], this.node)) {
                  index = i;
                }
              }
              if (index != undefined) $scope.expandedNodes.splice(index, 1);
            }
            if ($scope.onNodeToggle) $scope.onNodeToggle({
              node: this.node,
              expanded: expanding
            });
          };
          $scope.selectNodeLabel = function(selectedNode) {
            if (selectedNode[$scope.options.nodeChildren] && selectedNode[$scope.options.nodeChildren].length > 0 && !($scope.options.dirSelectable || ($scope.selectableFn({
              node: selectedNode
            })))) {
              this.selectNodeHead();
            } else {
              if (selectedNode[$scope.options.nodeChildren] && selectedNode[$scope.options.nodeChildren].length > 0 && $scope.options.expandWhenSelected) {
                this.selectNodeHead();
              }
              if ($scope.selectedNode != selectedNode) {
                $scope.selectedNode = selectedNode;
              }
              if ($scope.onSelection && $scope.selectableFn({
                node: selectedNode
              })) $scope.onSelection({
                node: selectedNode
              });
            }
          };
          $scope.selectedClass = function() {
            var labelSelectionClass = classIfDefined($scope.options.injectClasses.labelSelected, false);
            var injectSelectionClass = "";
            if (labelSelectionClass && (this.node == $scope.selectedNode)) injectSelectionClass = " " + labelSelectionClass;
            return (this.node == $scope.selectedNode) ? "tree-selected" + injectSelectionClass : "";
          };
          //tree template
          var template = '<ul ' + classIfDefined($scope.options.injectClasses.ul, true) + '>' + '<li ng-repeat="node in node.' + $scope.options.nodeChildren + ' | orderBy:orderBy:reverseOrder |filter:filterItem" ng-class="headClass(node)" class=" tree-first-level' + classIfDefined($scope.options.injectClasses.li, false) + '">' + '<div class="tree-row"><i class="tree-branch-head" ng-class="iBranchClass()" ng-click="selectNodeHead(node)"></i>' + '<i class="tree-leaf-head ' + classIfDefined($scope.options.injectClasses.iLeaf, false) + '"></i>' + '<div class="tree-label ' + classIfDefined($scope.options.injectClasses.label, false) + '" ng-class="selectedClass()" ng-click="selectNodeLabel(node)" tree-transclude></div></div>' + '<treeitem ng-if="nodeExpanded()"></treeitem>' + '</li>' + '</ul>';
          var treeitemTemplate = '<ul ' + classIfDefined($scope.options.injectClasses.ul, true) + '>' + '<li ng-repeat="node in node.' + $scope.options.nodeChildren + ' | orderBy:orderBy:reverseOrder |filter:filterItem" ng-class="headClass(node)" ' + classIfDefined($scope.options.injectClasses.li, true) + '>' + '<div class="tree-row" data-model="{{options.addAttr(node)}}"><i class="tree-branch-head" ng-class="iBranchClass()" ng-click="selectNodeHead(node)"></i>' + '<i class="tree-leaf-head ' + classIfDefined($scope.options.injectClasses.iLeaf, false) + '"></i>' + '<div class="tree-label ' + classIfDefined($scope.options.injectClasses.label, false) + '" ng-class="selectedClass()" ng-click="selectNodeLabel(node)" tree-transclude></div></div>' + '<treeitem ng-if="nodeExpanded()"></treeitem>' + '</li>' + '</ul>';
          return {
            template: $compile(template),
            treeitemTemplate: $compile(treeitemTemplate)
          }
        }
      ],
      compile: function(element, attrs, childTranscludeFn) {
        return function(scope, element, attrs, treemodelCntr) {
          scope.$watch("treeModel", function updateNodeOnRootScope(newValue) {
            if (angular.isArray(newValue)) {
              if (scope.node != null && angular.equals(scope.node[scope.options.nodeChildren], newValue)) return;
              scope.node = {};
              scope.node[scope.options.nodeChildren] = newValue;
            } else {
              if (angular.equals(scope.node, newValue)) return;
              scope.node = newValue;
            }
          });
          scope.$watchCollection('expandedNodes', function(newValue) {
            var notFoundIds = 0;
            var newExpandedNodesMap = {};
            var $liElements = element.find('li');
            var existingScopes = [];
            // find all nodes visible on the tree and the scope $id of the scopes including them
            angular.forEach($liElements, function(liElement) {
              var $liElement = angular.element(liElement);
              var liScope = $liElement.scope();
              existingScopes.push(liScope);
            });
            // iterate over the newValue, the new expanded nodes, and for each find it in the existingNodesAndScopes
            // if found, add the mapping $id -> node into newExpandedNodesMap
            // if not found, add the mapping num -> node into newExpandedNodesMap
            angular.forEach(newValue, function(newExNode) {
              var found = false;
              for (var i = 0;
                (i < existingScopes.length) && !found; i++) {
                var existingScope = existingScopes[i];
                if (scope.options.equality(newExNode, existingScope.node)) {
                  newExpandedNodesMap[existingScope.$id] = existingScope.node;
                  found = true;
                }
              }
              if (!found) newExpandedNodesMap[notFoundIds++] = newExNode;
            });
            scope.expandedNodesMap = newExpandedNodesMap;
          });
          //                        scope.$watch('expandedNodesMap', function(newValue) {
          //
          //                        });
          //Rendering template for a root node
          treemodelCntr.template(scope, function(clone) {
            element.html('').append(clone);
          });
          // save the transclude function from compile (which is not bound to a scope as apposed to the one from link)
          // we can fix this to work with the link transclude function with angular 1.2.6. as for angular 1.2.0 we need
          // to keep using the compile function
          scope.$treeTransclude = childTranscludeFn;
        }
      }
    };
  }

  function treeitem() {
    return {
      restrict: 'E',
      require: "^ccTree",
      link: function(scope, element, attrs, treemodelCtrl) {
        // Rendering template for the current node
        treemodelCtrl.treeitemTemplate(scope, function(clone) {
          element.html('').append(clone);
        });
      }
    }
  }

  function treeTransclude() {
    return {
      link: function(scope, element, attrs, controller) {
        if (!scope.options.isLeaf(scope.node)) {
          angular.forEach(scope.expandedNodesMap, function(node, id) {
            if (scope.options.equality(node, scope.node)) {
              scope.expandedNodesMap[scope.$id] = scope.node;
              scope.expandedNodesMap[id] = undefined;
            }
          });
        }
        if (scope.options.equality(scope.node, scope.selectedNode)) {
          scope.selectNodeLabel(scope.node);
        }
        // create a scope for the transclusion, whos parent is the parent of the tree control
        scope.transcludeScope = scope.parentScopeOfTree.$new();
        scope.transcludeScope.node = scope.node;
        scope.$on('$destroy', function() {
          scope.transcludeScope.$destroy();
        });
        scope.$treeTransclude(scope.transcludeScope, function(clone) {
          element.empty();
          element.append(clone);
        });
      }
    }
  }
});