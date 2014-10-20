define(function(){
  var diName = 'hasFeature';
  return {
    __register__: function(mod){
      mod.directive(diName, ['permissions', hasFeature]);
    }
  };

  function hasFeature(permissions){
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs){
        if(!_.isString($attrs.hasFeature)){
          return;
        }

        var value = $attrs.hasFeature.trim(),
          notFeatureTag = value[0] === '!';
        if(notFeatureTag){
          value = value.slice(1).trim();
        }
        toggleVisibilityByPermission();

        function toggleVisibilityByPermission(){
          var hasFeature = permissions.hasFeatures(value);

          if(hasFeature && !notFeatureTag || !hasFeature && notFeatureTag){
            $element.show();
          }else{
            $element.hide();
          }
        }
      }
    }
  }
});