define(function(){
  function prefixSlash(path){
    if(!path || !path.length) return '/';
    path = path.trim();
    if(path[0] !== '/') return '/'+path;
    return path;
  }

  function ObjToQueryStr(obj){
    var parasAry = [];
    for(var key in obj){
      parasAry.push(key+'='+obj[key]);
    }
    return parasAry.join('&');
  }

  return {
    prefixSlash: prefixSlash,
    ObjToQueryStr: ObjToQueryStr
  }
});