/**
 * Localize text
 * @param  {String} query Name of localized text
 * @return {String}       Localized text
 */
var localize = function(query) {
  return chrome.i18n.getMessage(query);
};

/**
 * Default content of blacklist
 * @type {Array}
 */
var defaultBlacklist = [
  'ask.fm',
  'sprashivai.ru',
  'formspring.me',
  'my-truth.ru',
  'askbook.me',
  'askme.by',
  'qroom.ru',
  'nekto.me'
];

/**
 * Remove empty elements from an array
 * @param  {Array} array
 * @return {Array}
 */
var cleanArray = function(array) {
  var newArray = new Array();
  for(var i = 0; i < array.length; i++)
    if (array[i]) newArray.push(array[i]);
  return newArray;
};

/**
 * Get current blacklist content
 * @return {Array}
 */
var links = function() {
  var links = ownLocalStorage['clearvk_withLinks_content'];
  return (links === undefined) ? [] : (links === 'clearvk_withLinks_content') ? defaultBlacklist : cleanArray(links.split(';'));
};

/**
 * Option's names and values
 */
var idsOfOptions = {
  'clearvk_class': 1,
  'clearvk_repostFromGroups': 1,
  'clearvk_withLinks': 1,
  'clearvk_withVideo': 0,
  'clearvk_withAudio': 0,
  'clearvk_groupShare': 0,
  'clearvk_fromApps': 0
};

/**
 * Vkleaner localStorage emulator
 */
var ownLocalStorage = {};

/**
 * Vkleaner localStorage manager
 * @class
 *
 * @see ownLocalStorage
 */
var localStorageManager = {
  /**
   * Set value by name
   * @param {String} name
   * @param {String} value
   */
  set: function(name, value) {
    chrome.extension.sendRequest({type: 'set', name: name, value: value});
  },
  /**
   * Get value by name
   * @param  {String} name
   */
  get: function(name) {
    chrome.extension.sendRequest({type: 'get', name: name}, function(response) {
      var value;
      if (response === null || response == '')
        value = (idsOfOptions[name] === undefined) ? name : idsOfOptions[name];
      else
        value = response;
      ownLocalStorage[name] = value;
    });
  },
  /**
   * Select all values of local storage to ownLocalStorage
   * @param  {String} [anotherId]
   */
  getAllSettings: function(anotherId) {
    for (var id in idsOfOptions)
      this.get(id);
    if (anotherId)
      this.get(anotherId)
  }
};
