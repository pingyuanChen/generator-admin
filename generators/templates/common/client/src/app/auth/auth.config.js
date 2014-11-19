define(['./securityInterceptor'], function(securityInterceptor) {
  var VIEW_LOGIN = '/login';
  return function config(mod) {
    securityInterceptor(mod)
      .config(['$stateProvider',
        function($stateProvider) {
          $stateProvider
            .state('login', {
              title: 'Login',
              url: '/login',
              templateUrl: 'app/auth/login.html',
              controller: 'LoginCtrl'
            });
        }
      ])
      .run(['$rootScope', '$log', '$state', '$location', 'permissions', 'session', 'authenticator',
        function($rootScope, $log, $state, $location, permissions, session, authenticator){
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if(toState.name == 'login'){
              session.clear();
            }else{
              if(!authenticator.isLogin()){
                $state.go('login');
                event.preventDefault();
              }
              //state change之前检查下用户是否有该权限
              var permission = {
                model: toState.data && toState.data.model || '',
                action: toState.data && toState.data.action || []
              };
              if(!permissions.hasPermissions(permission)){
                //如果没有权限，则停留在当前页面，或者提示
                alert('unauthorized !');
                //event.preventDefault();
              }
            }
          });
          $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($location.search().popup){
              angular.element('body').addClass('popup');
            }
          });
            // .$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
            //   $log.error('[stateNotFound]: '+ unfoundState.to);
            //   alert('can not found page');
            // });

          $rootScope.$watch(function(){
            return session.sessionId;
          }, function(){
            permissions.setPermissions(session.permissions);
            permissions.setFeatures(session.features);
          });
        }
      ]);
  };
});