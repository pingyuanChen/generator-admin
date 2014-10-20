define(function(){
  var diName = 'TopbarCtrl';
  return {
    __register__: function(mod){
      mod.controller(diName, ['$scope', 'authenticator', 'session', TopbarCtrl]);
      return mod;
    }
  };
  function TopbarCtrl($scope, authenticator, session){
    $scope.getUsername  = function(){
      return session.username
    };
    $scope.logout = function(){
      authenticator.logout();
    };
  }
});