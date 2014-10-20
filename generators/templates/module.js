define([
  './<%= camelModuleName %>.config',
  'common/utils/registerToModule'
], function(<%= camelModuleName %>Config, rtm) /*invoke*/ {
  var modName = 'app.<%= camelModuleName %>',
    mod = angular.module(modName, []);
  rtm()(mod);
  <%= camelModuleName %>Config(mod);
  return modName;
});