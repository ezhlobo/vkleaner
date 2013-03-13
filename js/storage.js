var

  /**
   * Storage manager
   */
  StorageManager = new (function() {
    function StorageManager() {};

    /**
     * Items of storage
     * @type {Object}
     */
    StorageManager.prototype.items = {};

    /**
     * Set storage item
     * @param {String}   name
     * @param {Number}   value
     * @param {Function} callback
     */
    StorageManager.prototype.set = function( name, value, callback ) {
      var object = {};
      object[ name ] = value;

      return chrome.storage.sync.set( object, callback || function() {});
    };

    /**
     * Select storage item
     * @param {Array|String} names
     * @param {Function}     fnAfterSelect
     */
    StorageManager.prototype.select = function( names, fnAfterSelect ) {
      var _this = this;

      return chrome.storage.sync.get( names, function( object ) {
        _this.items = hata.extend({}, idsOfOptions, fixedFirstLoadObject, _this.items, object );
        if ( fnAfterSelect ) {
          fnAfterSelect.call( this );
        }
      });
    };

    /**
     * Select every storage item
     * @param {Function} fnAfterSelect
     */
    StorageManager.prototype.selectAll = function( fnAfterSelect ) {
      return this.select( idsOfOptionsKeys, fnAfterSelect );
    };

    /**
     * Add onChanged listener
     * @param {Function} callback
     */
    StorageManager.prototype.onChanged = function( callback ) {
      return chrome.storage.onChanged.addListener( callback );
    };

    return StorageManager;
  })(),

  /**
   * Default value for items[clearvk_withLinks_content]
   */
  fixedFirstLoadObject = {
    "clearvk_withLinks_content": "clearvk_withLinks_content"
  },

  Storage = new StorageManager();
