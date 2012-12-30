/**
 * Localize text
 * @param  {String} query Name of localized text
 * @return {String}       Localized text
 */
var localize = function(query) {
  return chrome.i18n.getMessage(query);
};

var localize_options = localize('options');
var localize_yes = localize('options_yes');
var localize_feed_openlink = localize('feed_openlink');
var localize_post_was_deleted = localize('post_was_deleted');

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
var links = function(content) {
  var links = content ? content : ownLocalStorage.items['clearvk_withLinks_content'];
  return (links === undefined) ? [] : (links === 'clearvk_withLinks_content') ? defaultBlacklist : cleanArray(links.split(';'));
};

/**
 * Option's names and values
 */
var idsOfOptions = {
  'clearvk_class': 1,
  'clearvk_repostFromGroups': 1,
  'clearvk_repostFromUsers': 0,
  'clearvk_withLinks': 1,
  'clearvk_withVideo': 0,
  'clearvk_withAudio': 0,
  'clearvk_groupShare': 0,
  'clearvk_fromApps': 0
};
