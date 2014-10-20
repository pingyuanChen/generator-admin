define(function(){
  return function registerToModule(){
    var dependencies = arguments,
        len = dependencies.length,
        i;
    return function(_module){
      var dep;
      for(i = 0; i< len; i++){
        dep = dependencies[i];
        if(dep && typeof dep.__register__ === 'function'){
          dep.__register__(_module);
        }
      }
      return _module;
    };
  };
});