/**
 * Local storage emulator
 * @class
 */
ownLocalStorage = function() {
  var ls = {};

  /**
   * Items of local storage
   * @type {Object}
   * @memberOf ownLocalStorage
   */
  ls.items = {}

  /**
   * Select item of local storage
   * @param  {String} name
   * @memberOf ownLocalStorage
   */
  ls.select = function(name) {
    chrome.extension.sendRequest({type: 'get', name: name}, function(response) {
      var value;
      if (response === null || response == '')
        value = (idsOfOptions[name] === undefined) ? name : idsOfOptions[name];
      else
        value = response;
      ls.items[name] = value;
    });
  };

  /**
   * Select all items of local storage
   * @memberOf ownLocalStorage
   */
  ls.selectAll = function() {
    for (var id in idsOfOptions)
      ls.select(id);
    ls.select('clearvk_withLinks_content');
  };

  return ls;
}();
