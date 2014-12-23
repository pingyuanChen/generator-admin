define([
  './contenteditable',
  './ccTree',
  './dpMultiDropdown',
  './cascadeDropdown',
  './ccLoadingLayer',
  './dInputSync',
  './dHighChart',
  './dpHighChart',
  './dropdownBtn',
  './splitDropdown',
  './hasFeature',
  'common/utils/registerToModule'], function(contenteditable, ccTree, dpMultiDropdown, cascadeDropdown, ccLoadingLayer,dInputSync, dHighChart, dpHighChart, dropdownBtn, splitDropdown, hasFeature, rtm) {
  var authModName = 'app.widgets',
    mod = angular.module(authModName, []);
  rtm(
      contenteditable,
      ccTree,
      dpMultiDropdown,
      cascadeDropdown,
      ccLoadingLayer,
      dInputSync,
      dHighChart,
      dpHighChart,
      dropdownBtn,
      splitDropdown,
      hasFeature
    )(mod);
  return authModName;
});