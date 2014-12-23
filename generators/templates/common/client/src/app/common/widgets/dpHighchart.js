define(function() {
  var diName = 'dpHighchart';
  return {
    __register__: function(mod) {
      mod.directive(diName, DpHighchart);
    }
  };

  function DpHighchart() {
    return {
      restrict: 'E',
      scope: {
        chartConfig: "="
      },
      link: function($scope, $element, $attr) {
        $scope.$watch('chartConfig', function(newValue, oldValue){
          if(newValue){
            $element.highcharts($scope.chartConfig);
          }
        });
      }
    }
  }
});