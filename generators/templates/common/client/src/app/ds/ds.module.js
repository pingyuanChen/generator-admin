define([
  './apiService',
  'common/utils/registerToModule'
], function(apiService, rtm) /*invoke*/ {
  var modName = 'app.ds',
      mod = angular.module(modName,[]);
  rtm(apiService)(mod);
  return modName;
});