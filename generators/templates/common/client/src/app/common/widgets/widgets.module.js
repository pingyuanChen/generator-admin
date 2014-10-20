define([
  './contenteditable',
  './ccTree',
  './multiDropdown',
  './cascadeDropdown',
  './ccLoadingLayer',
  './dInputSync',
  './dHighChart',
  './dropdownBtn',
  './splitDropdown',
  './hasFeature',
  'common/utils/registerToModule'], function(contenteditable, ccTree, multiDropdown, cascadeDropdown, ccLoadingLayer,dInputSync, dHighChart, dropdownBtn, splitDropdown, hasFeature, rtm) {
  var authModName = 'app.widgets',
    mod = angular.module(authModName, []);
  rtm(
      contenteditable,
      ccTree,
      multiDropdown,
      cascadeDropdown,
      ccLoadingLayer,
      dInputSync,
      dHighChart,
      dropdownBtn,
      splitDropdown,
      hasFeature
    )(mod);
  return authModName;
});