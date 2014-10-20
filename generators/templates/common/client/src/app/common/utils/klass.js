define(function() {
  var inherits = function(ctor, superCtor) {
    if (!_.isFunction(ctor)) {
      throw new TypeError("first argument should be a Function!!!");
    }
    ctor._super_ = superCtor.prototype; // use ctor._super_[fn] to use parent's fn
    var _proto_ = ctor.prototype;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false
      },
      _super_: { // use this._super_[fn] to use parent's fn
        value: superCtor.prototype,
        enumerable: false
      },
    });
    _.extend(ctor.prototype, _proto_);
    return ctor;
  };
  var ext = function(superCtor, properties) {
    var ctor = function() {
      return superCtor.apply(this, arguments);
    };
    inherits(ctor, superCtor);
    _.extend(ctor.prototype, properties);
    return ctor;
  };

  return {
    inherits: inherits,
    ext: ext
  };
});