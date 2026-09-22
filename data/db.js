(function () {
  "use strict";

  var DB_NAME = "portafolio-evidencias-db";
  var DB_VERSION = 1;
  var dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains("evidencias")) {
          db.createObjectStore("evidencias", { keyPath: "id" });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }

  function reqToPromise(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  window.EvidenciasDB = {
    getAll: function () {
      return openDB().then(function (db) {
        return reqToPromise(db.transaction("evidencias", "readonly").objectStore("evidencias").getAll());
      });
    },
    put: function (evidencia) {
      return openDB().then(function (db) {
        return reqToPromise(db.transaction("evidencias", "readwrite").objectStore("evidencias").put(evidencia));
      });
    },
    delete: function (id) {
      return openDB().then(function (db) {
        return reqToPromise(db.transaction("evidencias", "readwrite").objectStore("evidencias").delete(id));
      });
    }
  };
})();
