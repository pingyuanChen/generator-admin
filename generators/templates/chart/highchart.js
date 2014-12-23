define([
  'common/utils/date',
  'common/utils/dataConverter',
  'common/utils/chartAdapter'
], function(dateUtil, dataConverter, chartAdapter) {
  var diName = '<%= capitalModelName %>ListCtrl';
  return {
    __register__: function(mod) {
      mod.controller(diName, ['$scope', 'logger', 'ds.<%= camelModelName %>', <%= capitalModelName %>ListCtrl]);
      return mod;
    }
  };

  function <%= capitalModelName %>ListCtrl($scope, logger, DS) {
    var apiParams = {};
  <% _.forEach(charts, function(ele, index){ %>
    $scope['isCollapse<%= index %>'] = false;//init the collapse component
    $scope['config<%= index %>'] = <%= JSON.stringify(ele) %>;
  <% }); %>

  <% if(!filter_type || filter_type != false){ %>
    $scope.filter = function(node, isInit) {
      _.extend(apiParams, node.selectedValue);
      if (!isInit) {
        reloadChart();
      }
    };
  <% } %>

  <% if(!search_field || search_field!=false){ %>
    $scope.clearSearch = function(){
      $scope.search.string = '';
    };
    $scope.goSearch = function(){
      apiParams.searchKeyword = $scope.search.string;
      reloadChart();
    };
  <% } %>

  <% if(!list_datepicker || list_datepicker != false){ %>
    var _dateFormat = function(date) {
      return dateUtil.format(date, 'YY-MM-dd');
    };
    var onChangeDate = function(newDate, oldDate) {
      if (newDate.getDate() == oldDate.getDate()) {
        return;
      }
      apiParams.start = _dateFormat($scope.datePicker.start.dt);
      apiParams.end = _dateFormat($scope.datePicker.end.dt);
      reloadChart();
    };
    $scope.datePicker = {
      start: {
        dt: dateUtil.getRelativeDate(-1, new Date())
      },
      end: {
        max: _dateFormat(new Date()),
        dt: dateUtil.getRelativeDate(0, new Date())
      }
    };

    $scope.$watch('datePicker.start.dt', onChangeDate);
    $scope.$watch('datePicker.end.dt', onChangeDate);

    $scope.open = function($event, datePickerInput) {
      $event.preventDefault();
      $event.stopPropagation();
      datePickerInput.opened = true;
    };
  <% } %>

    function reloadChart(){
      DS.chart(apiParams)
        .then(function(data){
          var resData = DS.data,
            items = resData.items,
            filterData = resData.filters;
        <% if(filter_type == 'cascade-dropdown'){ %>
          if (!$scope.selectName) {
            var convertedData = dataConverter.filter(filterData);
            $scope.selectName = convertedData.selectName;
            $scope.selectOptions = convertedData.selectOptions;
          }
        <% }else if(filter_type == 'multi-dropdown'){ %>
          if(!$scope.selectOptions){
          //only assign at first time, because it would cause dpMultiDropdown model change and reset default value
            $scope.selectOptions = filterData;
          }
        <% } %>

          _.each(items, function(ele, index){
            $scope['chartConfig'+index] = chartAdapter($scope['config'+index], ele);
          });
        }, function(error){
          logger.error('load chart failed.');
        });
    }

    reloadChart();
  }
});