define(function(){
  var diName = 'ccLoadingLayer';
  return {
    __register__: function(mod){
      mod.directive(diName, CCLoadingLayer);
      return mod;
    }
  };
  function CCLoadingLayer(){
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs){
        console.log('ccLoadingLayer');
        var loadingLayer = angular.element('<div class="loading-layer"></div>');
        element.append(loadingLayer);
        element.addClass('loading-container');
        scope.$watch(attrs.ccLoadingLayer, function(val){
          console.log('loading val:'+val);
          loadingLayer.toggleClass('ng-hide', !!val);
        });
      }
    };
  }
});