define(['./DataSource'], function(DataSource) {
  var basePath = '<%= lcaseModelName %>';

  var <%= capitalModelName %>DS = DataSource.ext({
    chart: function(params) {
      return this._load(basePath+'/chart', {
        params: params
      });
    }
  });
  return {
    __register__: function(mod) {
      mod.service('ds.<%= camelModelName %>', <%= capitalModelName %>DS);
      return mod;
    }
  };
})