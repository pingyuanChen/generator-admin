(function(head) {
  head.load([
    './vendor/jquery/dist/jquery.min.js',
    './vendor/angular/angular.min.js',
    './vendor/angular-sanitize/angular-sanitize.min.js',
    './vendor/angular-ui-router/release/angular-ui-router.min.js',
    './vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './vendor/ng-table/ng-table.min.js',
    './vendor/toastr/toastr.min.js',
    './vendor/requirejs/require.js',
    './vendor/underscore/underscore.js',
    './vendor/highcharts-release/highcharts.js'
  ]).ready('ALL', function() {
    // alert(require.config);
    requirejs.config({
      baseUrl: './app',
      paths: {
        'domReady': '../vendor/requirejs-domready/domReady',
        'text': '../vendor/requirejs-text/text'
      },
      deps: ['./bootstrap']
    });
    requirejs.onError = function(err) {
      console.log(err);
      if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
      }
      throw err;
    };
  });
})(window.head);