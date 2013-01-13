/**
 * Storage manager
 * @class
 */
var StorageManager = new (function() {
  function StorageManager() {};

  /**
   * Items of storage
   * @memberOf StorageManager
   * @type {Object}
   */
  StorageManager.prototype.items = {};

  /**
   * Set storage item
   * @param {String}   name     Name of item
   * @param {Number}   value    Value of item
   * @param {Function} callback
   */
  StorageManager.prototype.set = function(name, value, callback) {
    var object = {};
    object[name] = value;

    if (!callback) callback = function() {};

    return chrome.storage.sync.set(object, callback);
  };

  /**
   * Select storage item
   * @param  {Array|String} names
   * @param  {Function}     fnAfterSelect
   */
  StorageManager.prototype.select = function(names, fnAfterSelect) {
    var _this = this;

    return chrome.storage.sync.get(names, function(object) {
      _this.items = $.extend({}, idsOfOptions, _this.items, object);
      if (fnAfterSelect) fnAfterSelect.call(this);
    });
  };

  /**
   * Select every storage item
   * @param  {Function} fnAfterSelect
   */
  StorageManager.prototype.selectAll = function(fnAfterSelect) {
    return this.select(idsOfOptionsKeys, fnAfterSelect);
  };

  /**
   * Add onChanged listener
   * @param  {Function} callback
   */
  StorageManager.prototype.onChanged = function(callback) {
    return chrome.storage.onChanged.addListener(callback);
  };

  return StorageManager;
})();

var Storage = new StorageManager();
