define([], function() {
  var diName = 'LoginCtrl';
  return {
    __register__: function(mod) {
      mod.controller(diName, ['authenticator', '$rootScope', '$scope', '$q', 'logger', '$state', 'DEFAULT_STATE', LoginCtrl]);
    }
  };

  var SERVER_NOT_RESPONDING = "The server is not responding",
    UNABLE_TO_CONNECT = 'Unable to connect to secure dataservices',
    TIMEOUT_RESPONSE = 'Dataservice did not respond and timed out.',
    PAGE_NOT_FOUND = '404 Not Found';

  function LoginCtrl(authenticator, $rootScope, $scope, $q, logger, $state, DEFAULT_STATE) {
    var errorMessage = function(msg) {
        $scope.hasError = (msg !== '');
        $scope.errorMessage = msg || '';

        return $scope.errorMessage;
      },
      onLogin = function() {
        return authenticator
          .login($scope.credentials.username, $scope.credentials.password)
          .then(function successLogin(response) {
            logger.success('Login Success', 'Welcome ' + $scope.credentials.username + '!');
            $state.go(DEFAULT_STATE);
          }, function failedLogin(errorMsg) {
            // alert(errorMsg);
            logger.error('Login Failed', errorMsg);
            errorMsg = errorMsg || SERVER_NOT_RESPONDING;
            errorMessage(errorMsg.toString());

            return $q.reject(errorMsg);
          })
      };

    $scope.errorMessage = '';
    $scope.submit = onLogin;
  };
})
