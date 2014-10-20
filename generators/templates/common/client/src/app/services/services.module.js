define([
  './logger',
  'common/utils/registerToModule'
],function(logger, rtm){
  var modName = 'app.services',
    mod = angular.module(modName,[]);
  rtm(logger)(mod);

  return modName;
});