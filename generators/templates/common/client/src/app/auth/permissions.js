define(function(){
  var diName = 'permissions';
  return {
    __register__ : function(mod){
      mod.factory(diName, [permissions]);
    }
  };

  function permissions(){
    var permissionsList,
      featureList;
    return {
      setPermissions: function(permissions){
        //permissions: [{'model':'video', 'action':['add', 'modify', 'list', 'delete']}]
        permissionsList = _.indexBy(permissions, 'model');
      },
      setFeatures: function(features){
        featureList = features;
      },
      hasPermissions: function(permissions){
        if(!permissions || !permissions.model || permissions.action.length === 0){
          return true;
        }

        if(_.isArray(permissions)){
          //如果是数组，则数组每个元素都为true
          return _.every(permissions, _hasPermissions);
        }else{
          return _hasPermissions(permissions);
        }

        function _hasPermissions(permission){
          var modelPermissions = permissionsList[permission.model],
            actions = permission.action;
          return _.every(actions, function(item){
            if(modelPermissions){
              return _.contains(modelPermissions.action, item);
            }else{
              return false;
            }
          });
        }
      },
      hasFeatures: function(features){
        features = features.trim();
        if(!features){
          return false;
        }
        var featuresAry = features.split(' ');
        return _.every(featuresAry, _hasFeature);

        function _hasFeature(feature){
          return _.contains(featureList, feature);
        }
      }
    };
  }
})