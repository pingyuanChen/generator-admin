define(function(){
  var diName = 'splitDropdown';
  return {
    __register__: function(mod) {
      mod.directive(diName, [splitDropdown]);
      return mod;
    }
  };

  function splitDropdown($compile){
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        menu: '=',
        initMenu: '=',
        buttonClass: '=',
        onSelected: '&'
      },
      template: function(){
        return '\
          <div class="btn-group" dropdown>\
            <button type="button" class="btn dropdown-toggle" ng-class="buttonClass">{{selectedMenu || menu[0]}}</button>\
            <button type="button" class="btn dropdown-toggle" ng-class="buttonClass">\
              <span class="caret"></span>\
              <span class="sr-only">Split button!</span>\
            </button>\
            <ul class="dropdown-menu" role="menu">\
              <li ng-repeat="choice in menu" ng-click="clickMenu(choice)">{{choice}}</li>\
            </ul>\
          </div>';
      },
      link: function($scope, $element, $attrs){
        $scope.selectedMenu = $scope.initMenu || ($scope.menu && $scope.menu[0]);
        $scope.clickMenu = function(item){
          $scope.selectedMenu = item;
          $scope.onSelected && $scope.onSelected({node: item});
        }
      }
    }
  }
})