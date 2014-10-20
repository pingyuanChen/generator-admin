define(function() {
  var diName = 'apiService';
  return {
    __register__: function(mod) {
      mod.factory(diName, ['ENV', 'API', '$log', ApiFactory]);
    }
  };

  function ApiFactory(ENV, API, $log) {
    function getCfg(env) {
      var apiConfig = API[ENV];
      console.log(apiConfig);
      if (!apiConfig) {
        $log.error("[ApiConfig error]: unknown API configuration!");
        throw new Error("[ApiConfig error]: unknown API configuration!");
      }
      return apiConfig;
    }
    return {
      getApiUrl: function(dsUrl, env) {
        var apiConfig = getCfg(env);
        return apiConfig.domain + apiConfig.basePath + dsUrl;
      },
      getCustomApiUrl: function(url, env){
        var apiConfig = getCfg(env);
        return apiConfig.domain + url;
      }
      // addDomain: function(url, env) {
      //   var apiConfig = getCfg(env);
      //   return apiConfig.domain + url;
      // }
    };
  }
});