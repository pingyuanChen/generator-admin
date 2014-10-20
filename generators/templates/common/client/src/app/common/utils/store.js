define(function() {
  // short version of https://github.com/marcuswestin/store.js,
  // only support modern browsers (Firefox 4.0+, Chrome 11+, IE9+, iOS 4+)
  return function getStorage(storageName) {
    var win = window;
    getStorage._storeCache = getStorage._storeCache || {};
    if(getStorage._storeCache[storageName]) {
    	return getStorage._storeCache[storageName];
    }

    var store = {},
      doc = win.document,
      localStorageName = storageName,
      storage;
    store.disabled = false;
    store.serialize = function(value) {
      return JSON.stringify(value);
    };
    store.deserialize = function(value) {
      if (typeof value != 'string') {
        return undefined;
      }
      try {
        return JSON.parse(value);
      } catch (e) {
        return value || undefined;
      }
    };
    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
      try {
        return (localStorageName in win && win[localStorageName]);
      } catch (err) {
        return false;
      }
    }
    if (isLocalStorageNameSupported()) {
      store.supported = true;
      storage = win[localStorageName];
      store.set = function(key, val) {
        if (val === undefined) {
          return store.remove(key);
        }
        storage.setItem(key, store.serialize(val));
        return val;
      };
      store.get = function(key) {
        return store.deserialize(storage.getItem(key));
      };
      store.remove = function(key) {
        storage.removeItem(key);
      };
      store.clear = function() {
        storage.clear();
      };
      store.getAll = function() {
        var ret = {};
        store.forEach(function(key, val) {
          ret[key] = val;
        });
        return ret;
      };
      store.forEach = function(callback) {
        for (var i = 0; i < storage.length; i++) {
          var key = storage.key(i);
          callback(key, store.get(key));
        }
      };
      try {
        var testKey = '__storejs__';
        store.set(testKey, testKey);
        if (store.get(testKey) != testKey) {
          store.disabled = true;
        }
        store.remove(testKey);
      } catch (e) {
        store.disabled = true;
      }
      store.enabled = !store.disabled;
    } else {
      store.supported = false;
      store.enabled = false;
    }
    getStorage._storeCache[storageName] = store;
    return store;
  };
});