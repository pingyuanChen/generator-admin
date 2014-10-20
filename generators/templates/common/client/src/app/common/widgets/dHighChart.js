define(function() {
  var diName = 'dHighChart';
  return {
    __register__: function(mod) {
      mod.directive(diName, HighChart);
    }
  };

  function HighChart() {
    return {
      restrict: 'AE',
      scope: {
        chartData: "=",
        startDate: "=?",
        endDate: "=?",
        onDateChange: '&',
        ngShow: '=',
      },
      link: function($scope, $element, $attr) {
        function dateChangeHandler(newValue, oldValue) {
          if (newValue.getDate() === oldValue.getDate()) return;
          $scope.onDateChange();
        }

        function drawChart(chartData) {
          if (!chartData) return;
          if (chartData.status === 'failed') {
            $element.highcharts({
              title: {
                text: ''
              }
            });
            $element.highcharts().renderer.text(chartData.errorLog, $element.highcharts().plotWidth / 2 - 112.5, $element.highcharts().plotHeight / 2).css({
              color: 'red',
              fontSize: '20px'
            }).add();
            return;
          } else {
            if ($scope.ngShow) {
              $element.highcharts(chartData);
            }
          }
        }
        $element.highcharts($scope.chartData);
        $scope.$watch('ngShow', function(isShow) {
          if (isShow) {
            drawChart($scope.chartData);
          }
        });
        $scope.$watch('startDate', dateChangeHandler);
        $scope.$watch('endDate', dateChangeHandler);
        $scope.$watch('chartData', function(newValue, oldValue) {
          if (newValue === oldValue) return;
          drawChart(newValue);
        });
      }
    }
  }
});