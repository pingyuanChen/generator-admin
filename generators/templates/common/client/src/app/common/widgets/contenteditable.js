define(function(){
  var diName = 'contenteditable';
  return {
    __register__: function(mod){
      mod.directive(diName, ['$sce', contenteditable]);
      return mod;
    }
  };

  function contenteditable($sce){
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function($scope, $element, $attrs, ngModelCtrl){
        if(!ngModelCtrl) return;

        ngModelCtrl.$render = function(){
          //$element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue || ''));
          $element.text(ngModelCtrl.$viewValue);
        }

        $element.on('blur keyup change', function(){
          $scope.$apply(read);
        });
        $element.on('$destroy', function(){
          $element.off('blur keyup change');
        });
        //read();
        ngModelCtrl.$render();

        function read(){
          var html = $element.text();
          if($attrs.stripBr && html == '<br>'){
            html = '';
          }
          ngModelCtrl.$setViewValue(html);
        }
      }
    };
  }
})