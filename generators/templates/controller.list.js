define(['common/utils/dataConverter'], function(dataConverter) {
  var diName = '<%= capitalModelName %>ListCtrl';
  return {
    __register__: function(mod) {
      mod.controller(diName, ['$scope', '$state', '$filter', 'ngTableParams', 'ds.<%= camelModelName %>', 'logger', 'apiService', 'PER_PAGE', <%= capitalModelName %>ListCtrl]);
      return mod;
    }
  };

  function <%= capitalModelName %>ListCtrl($scope, $state, $filter, ngTableParams, DS, logger, apiService, PER_PAGE) {
    var apiParams = {};

  <% if(!list_actions || _.indexOf(list_actions, 'add') > -1){ %>
    $scope.add<%= capitalModelName%> = function(){
      $state.go('<%= sluggyModuleName %>.add-<%= sluggyModelName %>');
    };
  <% } %>
  <% if(list_display_link){ %>
    $scope.edit = function(item){
      $state.go('<%= sluggyModuleName %>.edit-<%= sluggyModelName %>', {id: item.id});
    };
  <% } %>
  <% if(modelEditList.length > 0){ %>
    $scope.saveItem = function(item){
      save([item.id]);
    };
    $scope.saveAll = function(){
      var checked = getCheckedValue($scope.checkboxes.items);
      if(checked.length === 0){
        logger.warning('Please select a content!');
        return;
      }
      save(checked);
    };
    function save(items, callback){
      DS.add(items)
        .then(function(){
          callback && callback();
        }, function(error){
          //save failed
        });
    }
  <% } %>

  <% if(list_filter_type == 'cascade-dropdown'){ %>
    $scope.filter = function(node, isInit) {
      if (!isInit) {
        apiParams = node.selectedValue;
        $scope.<%= camelModelName %>TableParams.page(1);
        $scope.<%= camelModelName %>TableParams.reload();
      }
    };
  <% }else if(list_filter_type == 'simple-dropdown'){ %>
    $scope.filter = function(){
      var curOption = _.find($scope.filterData.values, function(item){
        return item.value = $scope.filterModel;
      });
      if(curOption){
        apiParams[curOption.name] = curOption.value;
        $scope.<%= camelModelName %>TableParams.page(1);
        $scope.<%= camelModelName %>TableParams.reload();
      }
    };
  <% } %>

  <% if(!search_field || search_field!=false){ %>
    $scope.clearSearch = function(){
      $scope.search.string = '';
    };
    $scope.search = function(){
      apiParams.searchKeyword = $scope.search.string;
      $scope.<%= camelModelName %>TableParams.page(1);
      $scope.<%= camelModelName %>TableParams.reload();
    };
  <% } %>
    var resetCheckBoxes = function() {
      $scope.checkboxes = {
        'checked': false,
        items: {}
      };
    };
    // watch for check all checkbox
    $scope.$watch('checkboxes.checked', function(value) {
      if (value === false) {
        $scope.checkboxes.items = {};
        return;
      }
      angular.forEach($scope.items, function(item) {
        if (angular.isDefined(item.id)) {
          $scope.checkboxes.items[item.id] = value;
        }
      });
    });
    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
      if (!$scope.items) {
        return;
      }
      var checked = 0,
        unchecked = 0,
        total = $scope.items.length;
      angular.forEach($scope.items, function(item) {
        checked += ($scope.checkboxes.items[item.id]) || 0;
        unchecked += (!$scope.checkboxes.items[item.id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        $scope.checkboxes.checked = (checked == total);
      }
      // grayed checkbox
      angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

    $scope.<%= camelModelName %>TableParams = new ngTableParams({
      page: 1,
      count: PER_PAGE
    }, {
      isCurrent: function(page, params) {
        return page.number === params.page() && page.type !== 'prev' && page.type !== 'next';
      },
      getData: function($defer, params) {
        apiParams.limit = PER_PAGE;//add api parameter
        apiParams.index = params.page();

        $scope.isLoading = true;
        DS.list(apiParams).then(function() {
          var resData = DS.data,
            items = resData.items;
            filterData = resData.filters;
        <% if(list_filter_type == 'cascade-dropdown'){ %>
          if (!$scope.selectName) {
            var convertedData = dataConverter.filter(filterData);
            $scope.selectName = convertedData.selectName;
            $scope.selectOptions = convertedData.selectOptions;
          }
        <% }else if(list_filter_type == 'simple-dropdown'){ %>
          $scope.filterData = dataConverter.simpleFilter(filterData);
          $scope.filterModel = $scope.filterData.defaultOption;
        <% } %>
          $scope.items = items;
          params.total(resData.total);
          $defer.resolve($scope.items);
          resetCheckBoxes();
          $scope.isLoading = false;
        }, function(){
          $scope.isLoading = false;
        });
      }
    });

    function getCheckedValue(items){
      var checked = [];
      //获取被选中的值
      for(var key in items){
        if(items[key] != null && items[key] !== false){//因为值可能刚好为0
          checked.push(key);
        }
      }
      return checked;
    }
  }
})
