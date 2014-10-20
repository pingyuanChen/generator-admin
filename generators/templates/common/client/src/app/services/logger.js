define(function() {
  var diName = 'logger';
  return {
    __register__: function(mod) {
      mod.factory(diName, ['$log', logger]);
      return mod;
    }
  };


  function logger($log) {
    var service = {
      showToasts: true,
      error: error,
      info: info,
      success: success,
      warning: warning,
      // straight to console; bypass toastr
      log: $log.log
    };
    return service;
    /////////////////////
    function error(title, message, data) {
      toastr.error(message, title);
      $log.error('Error: ' + message, data);
    }

    function info(title, message, data) {
      toastr.info(message, title);
      $log.info('Info: ' + message, data);
    }

    function success(title, message, data) {
      toastr.success(message, title);
      $log.info('Success: ' + message, data);
    }

    function warning(title, message, data) {
      toastr.warning(message, title);
      $log.warn('Warning: ' + message, data);
    }
  }
});