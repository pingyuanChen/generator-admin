define(function(){
  return function handleSessionInvalid(mod){
    mod.factory('securityInterceptor', ['$q', '$injector', securityInterceptor])
      .config(['$httpProvider', function($httpProvider){
        $httpProvider.interceptors.push('securityInterceptor');
      }]);
    return mod;
  };

  function securityInterceptor($q, $injector){
    var responseInterceptor = {
      responseError: function(response){
        if(response.status === 403 || response.status === 401){//status
          var $stateService = $injector.get('$state');//为了解决Circular dependency
          $stateService.go('login');
        }
        return $q.reject(response);
      }
    };

    return responseInterceptor;
  }

});