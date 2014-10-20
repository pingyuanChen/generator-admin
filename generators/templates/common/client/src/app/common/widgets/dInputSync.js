define(function() {
  var diName = 'dInputSync';
  return {
    __register__: function(mod) {
      mod.directive(diName, function() {
        return {
          restrict: 'A',
          controller: ['$scope', '$element', '$attrs', '$parse',
            function($scope, $element, $attrs, $parse) {
              var parser = $parse($attrs.keyPath);
              this.sync = function(val) {
                parser.assign($scope, val);
              }
            }
          ],
          link: function($scope, $element, $attributes, ctrl) {
            var parser = $element.on('keyup', function() {
              ctrl.sync($element.html());
            });
            $element.on('$destroy', function(){
              $element.off('keyup');
            });
            $scope.$watch($attributes.keyPath, function(val){
              $element.html(val);
            })
          }
        }
      });
      return mod;
    }
  };
});