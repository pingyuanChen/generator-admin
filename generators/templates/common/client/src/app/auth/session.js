define(['common/utils/guid', 'common/utils/store'], function(createGuid, getStore) {
  var store = getStore('localStorage'),
    session_key = 'user_session',
    session_timestamp_key = 'user_session_timestamp',
    expired_duration = 1000 * 60 * 120; // 2 hours
  // alert(store.enabled);
  var diName = 'session';
  return {
    __register__: function(mod) {
      mod.factory(diName, [sessionFactory]);
      return mod;
    }
  };

  function sessionFactory() {
    var _session = {
      sessionId: null,
      username: '',
      navData: null,
      permissions: null,
      features: null,
      clear: onClear,
      set: onSet,
      updateTimestamp: updateTimestamp,
      isExpired: isExpired
    };
    initSession();
    return _session;

    function initSession() {
      if (store.enabled) {
        if (_session.isExpired()) {
          _clearStorage();
        } else {
          var storedSession = store.get(session_key);
          _session.updateTimestamp();
          _syncSession(storedSession || {});
        }
      }
      console.log('[Init Session]');
      console.log(_session);
    }

    function onClear() {
      _session.sessionId = null;
      _session.username = '';
      _session.navData = null;
      _session.permissions = null;

      _clearStorage();
    }

    function onSet(opts) {
      opts.sessionId = createGuid();
      _syncSession(opts);//将opts的数据设置到session中并保存在localStorage

      store.set(session_key, opts);
      _session.updateTimestamp();

      console.log('[Update Session]');
      console.log(_session);
      return _session;
    }

    function isExpired() {
      function ft(num) {
        if (num > 1000 * 60 * 60) return (num / (1000 * 60 * 60)).toFixed(1) + ' hour';
        if (num > 1000 * 60) return (num / (1000 * 60)).toFixed(1) + ' minutes';
        if (num > 1000) return (Math.floor(num / 1000)) + 'secs';
        return num;
      }
      if (!store.enabled) return true;
      var lastSavedTimestamp = store.get(session_timestamp_key);
      if (!lastSavedTimestamp) { // has not save any data yet
        return true;
      } else {
        var now = Date.now(),
          diff = now - lastSavedTimestamp;
        //expired after two hour
        console.log("session update time diff(" + diff + "):" + ft(diff));
        return diff > expired_duration;
      }
    }

    function updateTimestamp() {
      if (store.enabled) {
        store.set(session_timestamp_key, Date.now());
      }
    }
    //helpers
    function _syncSession(opts) {
      _session.sessionId = opts.sessionId;
      _session.username = opts.username;
      _session.navData = opts.navData;
      _session.permissions = opts.permissions;
      _session.features = opts.features;
    }

    function _clearStorage() {
      store.remove(session_key);
      store.remove(session_timestamp_key);
    }

  }
});