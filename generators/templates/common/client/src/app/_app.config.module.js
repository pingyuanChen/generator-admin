define(function(){
  var modName = 'app.config';

  toastr.options.timeOut = 3000;//toaster的全局配置
  toastr.options.positionClass = 'toast-bottom-right';

  angular.module(modName, [])
    .constant('DEFAULT_STATE', '<%= defaultState %>')
    .constant('API', {
      'development': {
        domain: '<%= developmentDomain %>',
        basePath: '<%= developmentBaseUrl %>'
      },
      'release': {
        domain: '<%= releaseDomain %>',
        basePath: '<%= releaseBaseUrl %>'
      }
    })
    .constant('ENV', '<%= defaultEnv %>')
    .constant('PER_PAGE', 20);


  angular.module(modName)
    .config(['$logProvider',   //logger setting
      function($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
          $logProvider.debugEnabled(true);
        }
      }
    ])
    .config(['$httpProvider',
      function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
    ])
    .config(['$modalProvider', function($modalProvider) {   //default config for ngbootstrap
      $modalProvider.options.backdrop = 'static';
      $modalProvider.options.keyboard = false;
    }])
    .config(['$urlRouterProvider', function($urlRouterProvider){
      // for any unmatched url, redirect to default state
      $urlRouterProvider.otherwise('<%= defaultState %>');
    }]);


  angular.module(modName)
    .run(['$rootScope', 'DEFAULT_STATE', '$log', '$state', handleRoutingErrors])
    .run(['$rootScope', updateDocTitle]);


  var handlingRouteChangeError = false;
  function handleRoutingErrors($rootScope, DEFAULT_STATE, $log, $state) {
    // Route cancellation:
    // On routing error, go to the dashboard.
    // Provide an exit clause if it tries to do it twice.
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if (handlingRouteChangeError) {
        return;
      }
      handlingRouteChangeError = true;
      var destination = toState.to || 'unknown target';
      var msg = 'Error routing to ' + destination + '. ' + (error || '');
      $log.debug(msg);
      $state.go(DEFAULT_STATE);
    });
  }

  function updateDocTitle($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      handlingRouteChangeError = false;
      var title = (toState.title || '');
      $rootScope.title = title; // data bind to <title>
    });
  }

  return modName;
});