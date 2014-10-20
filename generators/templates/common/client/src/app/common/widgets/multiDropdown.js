define(function(){
  var diName = 'multiDropdown';
  return {
    __register__: function(mod) {
      mod.directive(diName, [multiDropdown]);
      return mod;
    }
  };

  function multiDropdown(){
    return {
      restrict: 'AE',
      scope: {
        selectedModel: '=',
        onSelected: '&'
      },
      template: function($element, $attrs){
        return '<select ng-options="item.name as item.alias for item in selectedModel" ng-model="cate" ng-change="updateSub()"></select>'+
              '<select ng-model="subCate" ng-options="subItem.value as subItem.display_value for subItem in subItems" ng-change="subcateChange()"></select>';
      },
      link: function($scope, $element, $attrs){
        $scope.$watch('selectedModel', function(newVal){
          if(newVal.length > 0){
            $scope.cate = newVal[0].name;
            updateSubItems();
          }
        });

        $scope.updateSub = function(){
          updateSubItems();
          onSelectedFun();
        }

        $scope.subcateChange = function(){
          onSelectedFun();
        }

        function onSelectedFun(){
          $scope.onSelected({
            node: {
              type: $scope.cate,
              cate: $scope.subCate,
              data: $scope.subItems
            }
          });
        }

        function updateSubItems(){
          var subList = _.find($scope.selectedModel, function(item){
            return item.name == $scope.cate;
          });
          $scope.subItems = subList.values;
          $scope.subCate = $scope.subItems[0].value;
        }
      }
    }
  }
});