define(function(){
  var diName = 'cascadeDropdown';
  return {
    __register__: function(mod) {
      mod.directive(diName, [cascadeDropdown]);
      return mod;
    }
  };

  function cascadeDropdown(){
    return {
      restrict: 'E',
      scope: {
        selectLabel: '=',
        selectName: '=',
        selectedModel: '=',
        onSelected: '&'
      },
      template: function($element, $attrs){
        if($attrs.selectLabel){//如果有label属性，则说明select旁边要加title
          return '<div class="form-group" ng-repeat="itemName in selectName">'+
                    '<label class="col-sm-4 control-label">{{selectLabel[$index]}}</label>'+
                    '<div class="col-sm-6">'+
                      '<select ng-options="item.value as item.display_value for item in selectedModel[itemName] | filter:{parent:checked[selectName[$index-1]]}:true" ng-model="checked[itemName]" ng-change="updateSub($index+1)"></select>'+
                    '</div>'+
                  '</div>';
        }else{
          return '<select ng-repeat="itemName in selectName" ng-options="item.value as item.display_value for item in selectedModel[itemName] | filter:{parent:checked[selectName[$index-1]]}:true" ng-model="checked[itemName]" ng-change="updateSub($index+1)"></select>';
        }
      },
      link: function($scope, $element, $attrs){
        $scope.checked = {};//存储所有的选项的model

        $scope.$watch('selectedModel', function(newVal){
          if(newVal){
            updateSelectModel(0);
            onSelectedFun(true);
          }
        });

        $scope.updateSub = function(index){
          updateSelectModel(index);
          onSelectedFun();
        }

        function onSelectedFun(isInit){
          $scope.onSelected({
            node: {
              selectedValue: $scope.checked
            },
            isInit: isInit || false
          });
        }

        function updateSelectModel(start){
          var key, item, filterAry, lastChecked;
          for(var i=start,l=$scope.selectName.length; i<l; i++){
            key = $scope.selectName[i];
            item = $scope.selectedModel[key];
            if(i === 0){
              //初始化第一个下拉框
              $scope.checked[key] = item[0].value;
            }else{
              lastChecked = $scope.checked[$scope.selectName[i-1]];
              filterAry = item.filter(function(ele){
                return ele.parent == lastChecked;
              });
              $scope.checked[key] = filterAry[0].value;
            }
          }
        }
      }
    }
  }
});