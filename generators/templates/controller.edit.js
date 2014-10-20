define([], function() {
  var diName = '<%= capitalModelName %>EditCtrl';
  return {
    __register__: function(mod) {
      mod.controller(diName, ['$scope', '$state', '$window', 'ds.<%= camelModelName %>', '$log', <%= capitalModelName %>EditCtrl]);
      return mod;
    }
  };

  function <%= capitalModelName %>EditCtrl($scope, $state, $window, DS, $log) {
    var stateParams = $state.params,
      isEditState = _.has(stateParams, 'id');

    clearForm();

    if(isEditState){
      DS.edit(stateParams.id)
        .then(function(data){
          $scope.entity = DS.data;
        })
        .then(function(){
          //handle the checkbox rendering when in edit page
          var checkboxItems = $('.checkbox-type'),
            item;
          for(var i=0,l=checkboxItems.length; i<l; i++){
            var item = checkboxItems[i]; 
              column = $(item).data('column'),
              columnItems = $(item).data('checkbox').split(',');
            $scope.entity[column].forEach(function(columnItem){
              var index = _.indexOf(columnItems, columnItem);
              $scope.checkbox[column+(index+1)] = index > -1 ? true : false;
            });
          }
        });
    }

    //init the collapse component
  <% var fieldsetsIndex = 0
    _.forIn(fieldsets, function(value, key){ 
      fieldsetsIndex += 1 %>
    $scope['isCollapse<%= fieldsetsIndex %>'] = false;
  <% }); %>

    $scope.save = function(){
      saveEntity(function(){
        $window.history.back();
      });
    };

    $scope.saveAndContinueEdit = function(){
      saveEntity();
    };

    $scope.saveAsNew = function(){
      saveEntity(function(){
        clearForm();
      });
    };

    $scope.change = function(modelName, itemName, item) {
      var modelValue = $scope.entity[modelName] || [];
      if($scope.checkbox[itemName]) { //if checked
        if(_.indexOf(modelValue, item) === -1) {
          modelValue.push(item);
        }
      } else {
        modelValue.splice(_.indexOf(modelValue, item), 1);
      }
      $scope.entity[modelName] = modelValue;
    };

    $scope.open = function($event, columnName) {//for datepicker
      $event.preventDefault();
      $event.stopPropagation();
      $scope[columnName] = true;
    };
    $scope.format = 'yyyy-MM-dd';

    function saveEntity(callback){
      return DS.add($scope.entity)
        .then(function(){
          callback && callback();
        }, function(error){
          //save failed
        });
    }

    function clearForm(){
      $scope.entity = {};
      $scope.checkbox = {};
    }
  }
})
