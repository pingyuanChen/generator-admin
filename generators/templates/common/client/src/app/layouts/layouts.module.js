define([
  './body',
  './leftnav/leftnav',
  './topbar/topbar',
  'common/utils/registerToModule'],
  function(bodyCtrl, LeftnavCtrl, TopbarCtrl, rtm){
    var modName = 'app.layouts',
        mod = angular.module(modName,[]);
        rtm(bodyCtrl, LeftnavCtrl, TopbarCtrl)(mod);
    return modName;
});