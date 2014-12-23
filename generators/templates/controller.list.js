define(['common/utils/date', 'common/utils/dataConverter'], function(dateUtil, dataConverter) {
  var diName = '<%= capitalModelName %>ListCtrl';
  return {
    __register__: function(mod) {
      mod.controller(diName, ['$scope', '$window', '$state', '$filter', '$location', '$modal', 'ngTableParams', 'ds.<%= camelModelName %>', 'logger', 'apiService', 'PER_PAGE', <%= capitalModelName %>ListCtrl]);
      return mod;
    }
  };

  function <%= capitalModelName %>ListCtrl($scope, $window, $state, $filter, $location, $modal, ngTableParams, DS, logger, apiService, PER_PAGE) {
    var apiParams = {};
    $scope.listChecked = [];
    $scope.listTotal = 0;

    $scope.isPopup = function(){
      return !!$location.search().popup;
    };
  <% if(!list_actions || _.indexOf(list_actions, 'add') > -1){ %>
    $scope.add<%= capitalModelName%> = function(){
      $state.go('<%= sluggyModuleName %>.add-<%= sluggyModelName %>');
    };
  <% } %>
  <% if(list_display_link){ %>
    $scope.edit = function(item){
      if($location.search().popup){
        var windowScope = $window.opener.angular.element('body').scope(),
          childWindowName = $window.name,
          childWindowLabel = $location.search().label || 'id',
          broadcastData = {};
        broadcastData.id = item.id;
        broadcastData[childWindowLabel] = item[childWindowLabel];
        if(childWindowName == 'from-ref'){
          windowScope.$broadcast('REF_LIST_SELECTED', broadcastData);
        }else{
          windowScope.$broadcast('INLINE_REF_LIST_SELECTED', broadcastData);
        }
        $window.close();
      }
      $state.go('<%= sluggyModuleName %>.edit-<%= sluggyModelName %>', {id: item.id});
    };
  <% } %>
  <% if(!list_actions || _.indexOf(list_actions, 'delete') > -1){ %>
    $scope.delete = function(){
      var deleteDialog;
      if($scope.listChecked.length === 0){
        logger.warning('Please select a content!');
        return;
      }
      deleteDialog = $modal.open({
        template: '<div class="modal-header">' +
                    '<a class="dialog-cancel" ng-click="cancel()">' +
                      '<span class="glyphicon glyphicon-remove"></span>' +
                    '</a>' +
                    '<h3 class="modal-title">delete action</h3>' +
                  '</div>' +
                  '<div class="modal-body">Are you absolutely sure you want to delete?</div>' +
                  '<div class="modal-footer">' +
                    '<button type="btn" class="btn btn-default" ng-click="cancel()">Close</button>' +
                    '<button class="btn btn-primary" ng-click="deleteAction()">Yes</button>' +
                  '</div>',
        scope: $scope,
        controller: ['$scope', '$modalInstance', 'ds.<%= camelModelName %>', function($scope, $modalInstance, DS){
          $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
          };

          $scope.deleteAction = function(){
            DS.delete($scope.listChecked)
              .then(function(){
                $modalInstance.dismiss('cancel');
                $scope.<%= camelModelName %>TableParams.page(1);
                $scope.<%= camelModelName %>TableParams.reload();
                logger.success('delete successfully');
              }, function(error){
                $modalInstance.dismiss('cancel');
                logger.error('delete failed.');
              });
          };
        }]
      });
    };
  <% } %>
    function save(items, callback){
      DS.update(items)
        .then(function(){
          callback && callback();
        }, function(error){
          //save failed
        });
    }
  <% if(modelEditList.length > 0){ %>
    $scope.saveAll = function(){
      if($scope.listChecked.length === 0){
        logger.warning('Please select a content!');
        return;
      }
      save($scope.listChecked, function(){
        resetCheckBoxes();
        logger.success('save successfully!');
      });
    };
  <% } %>
  <% if(list_table_actions && list_table_actions.length > 0){
    _.forEach(list_table_actions, function(tableAction){ 
      if(tableAction == 'save'){ %>
      $scope.save = function(item){
        save([item.id], function(){
          
        });
      };
      <% }else{ %>
        //TODO
      $scope.<%= tableAction %> = function(item){
      };
  <%  }
    })
  } %>
  <% if(!list_filter_type || list_filter_type != false){ %>
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
      $scope.<%= camelModelName %>TableParams.page(1);
      $scope.<%= camelModelName %>TableParams.reload();
    };
  <% } %>

  <% if(list_datepicker){ %>
    var _dateFormat = function(date) {
      return dateUtil.format(date, 'YY-MM-dd');
    };
    var onChangeDate = function(newDate, oldDate) {
      if (newDate.getDate() == oldDate.getDate()) {
        return;
      }
      apiParams.start = _dateFormat($scope.datePicker.start.dt);
      apiParams.end = _dateFormat($scope.datePicker.end.dt);
      $scope.<%= camelModelName %>TableParams.page(1);
      $scope.<%= camelModelName %>TableParams.reload();
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

      $scope.listChecked = getCheckedValue($scope.checkboxes.items);
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
        <% }else if(list_filter_type == 'multi-dropdown'){ %>
          if(!$scope.selectOptions){
          //only assign at first time, because it would cause dpMultiDropdown model change and reset default value
            $scope.selectOptions = filterData;
          }
        <% } %>
          $scope.items = items;
          $scope.listTotal = resData.total;
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

    function resetCheckBoxes() {
      $scope.checkboxes = {
        'checked': false,
        items: {}
      };
    };
  }
})
