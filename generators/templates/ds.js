define(['./DataSource'], function(DataSource) {
  var basePath = '<%= lcaseModelName %>';

  var <%= capitalModelName %>DS = DataSource.ext({
    list: function(params) {
      return this._load(basePath+'/list', {
        params: params
      });
    },
    add: function(params) {
      return this._update(basePath+'/add', {
        data: params
      });
    },
    edit: function(params) {
      return this._load(basePath+'/edit', {
        params: params
      });
    },
    update: function(params){
      if(_.isArray(params)){//update action from list page
        var items = this.data.items,
          postData = [];
        items = _.indexBy(items, 'id');
        params.forEach(function(itemId) {
          var item = items[itemId];
          postData.push(item);
        });
        params = postData;
      }else{//update action from edit page
        params = [params];
      }
      return this._update(basePath+'/update', {
        data: params
      });
    },
    delete: function(params) {
      return this._update(basePath+'/delete', {
        data: params
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