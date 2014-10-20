define([
  'common/utils/registerToModule'
], function(rtm) {
  var authModName = 'app.filters',
    mod = angular.module(authModName, []);
  //rtm()(mod);
  return authModName;
});