define(['common/utils/klass', 'common/utils/url'], function(klass, UrlUtil) {
  var defaultHttpConfig = {
    cache: false,
    responseType: 'json'
  };

  function _makeHttpConfig(httpConfig) {
    return _.extend({}, defaultHttpConfig, httpConfig);
  }

  var DataSource = function() {
      if (this.init) {
        this.init.apply(this, arguments);
      }
    },
    proto = DataSource.prototype;

  proto.init = function() {
    var injects = this.constructor.$inject,
      args = [].slice.call(arguments),
      thisDS = this;
    if (injects && injects.length) {
      injects.forEach(function(injectName, index) {
        thisDS[injectName] = args[index];
      });
    }
  }

  proto._makeHttpRequestPromise = function(ds, method, url, httpConfig) {
    var dfd = ds.$q.defer();
    httpConfig = _makeHttpConfig(httpConfig);
    httpConfig.url = url;
    httpConfig.method = method;
    //httpConfig.isModelData = httpConfig.isModelData != null ? !!httpConfig.isModelData : true;
    ds.$http(httpConfig).success(function(data, status, headers, config) {
      // if (method.toUpperCase() === 'GET' && config.isModelData === true) {
         ds.data = data.data;
      // }
      if (data.status && data.status !== 0) {
        ds._showToast(method, url, data);
        dfd.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      }
      dfd.resolve({
        data: data,
        status: status,
        headers: headers,
        config: config
      });
    }).error(function(data, status, headers, config) {
      ds._showToast(method, url, {
        msg: status
      });
      dfd.reject({
        data: data,
        status: status,
        headers: headers,
        config: config
      });
    });
    return dfd.promise;
  }
  proto._load = function(url, httpConfig) {
    return this._makeHttpRequestPromise(this, 'GET', this._getApiUrl(url), httpConfig);
  };
  proto._update = function(url, httpConfig) {
    return this._makeHttpRequestPromise(this, 'POST', this._getApiUrl(url), httpConfig);
  };
  proto._getApiUrl = function(dsUrl) {
    return this.apiService.getApiUrl(UrlUtil.prefixSlash(dsUrl));
  };
  // proto._getApiAbsUrl = function(url){
  //   return url;
  // };
  proto._showToast = function(method, url, option) {
    var showToast = this.showToast == null ? true : this.showToast;
    if (angular.isFunction(showToast)) {
      showToast.call(this, method, url, option);
      return;
    }
    if (showToast) {
      this.logger.error('Http Operation Failure', '[' + method.toUpperCase() + ']: ' + url + ' - ' + option.msg || '');
    }
  };
  proto.constructor = DataSource;
  DataSource.$inject = ['$http', '$q', 'logger', 'apiService'];
  DataSource.ext = function(opts, dependencise) {
    var childDS = klass.ext(DataSource, opts);
    if (dependencise && dependencise.length) {
      childDS.$inject = dependencise;
    } else {
      childDS.$inject = DataSource.$inject;
    }
    return childDS;
  };
  return DataSource;
});
