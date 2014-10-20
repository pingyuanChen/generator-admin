define([],function(){
  var diName = 'BodyCtrl';
  return {
    __register__: function(mod){
      mod.controller(diName, ['$scope', 'authenticator', BodyCtrl]);
      return mod;
    }
  };

  function BodyCtrl($scope, authenticator){
    $scope.isLogin = authenticator.isLogin;
  }
});