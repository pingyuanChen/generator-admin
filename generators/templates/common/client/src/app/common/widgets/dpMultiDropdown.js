define(function(){
  var diName = 'dpMultiDropdown';
  return {
    __register__: function(mod) {
      mod.directive(diName, [dpMultiDropdown]);
      return mod;
    }
  };

  function dpMultiDropdown(){
    return {
      restrict: 'AE',
      scope: {
        selectedModel: '=',
        onSelected: '&'
      },
      template: function($element, $attrs){
        return '<select ng-repeat="selectItem in selectedModel" ng-options="item.value as item.display_value for item in selectItem.items" ng-model="checked[selectItem.name]" ng-change="change()"></select>';
      },
      link: function($scope, $element, $attrs){
        $scope.checked = {};//存储所有的选项的model
        $scope.$watch('selectedModel', function(newVal, oldVal){
          if(newVal && newVal.length > 0){
            _.each(newVal, function(ele){
              $scope.checked[ele.name] = ele['default'] || ele.items[0].value;
            });
          }
        });

        $scope.change = function(){
          $scope.onSelected({
            node: {
              selectedValue: $scope.checked
            }
          });
        };

      }
    }
  }
});