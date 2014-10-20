define(['./authenticator', './session', './permissions', './login', './auth.config', 'common/utils/registerToModule'], function(authenticator, session, permissions, LoginCtrl, authConfig, rtm) {
  var authModName = 'app.auth',
    mod = angular.module(authModName, []);
  rtm(authenticator, session, permissions, LoginCtrl)(mod);
  authConfig(mod);
  return authModName;
})