/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
  'app.config.module',
  'services/services.module',
  'common/widgets/widgets.module',
  'common/filters/filters.module',

  'auth/auth.module',
  'ds/ds.module',
  'layouts/layouts.module'
], function(appConfig, services, widgets, filters, auth, ds, layouts) /*invoke*/ {
  'use strict';

  var appMod = angular.module('app', [
    'ui.bootstrap',
    'ngTable',
    'ui.router',
    'ngSanitize',

    appConfig,
    services,
    widgets,
    filters,
    auth,
    ds,
    layouts
  ]); /*ngDeps*/
  return 'app';
});
