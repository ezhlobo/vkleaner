// Return localized text
var localize = function(query) {
  return chrome.i18n.getMessage(query);
};

// Black list of links by default
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

var linksSeparator = ';';
var links = function() {
  var links = ownLocalStorage['clearvk_withLinks_content'].toString();
  return links ? links.split(linksSeparator) : defaultBlacklist;
};

// Ids of options and their default values
var idsOfOptions = {
  'clearvk_class': 1,
  'clearvk_repostFromGroups': 1,
  'clearvk_withLinks': 1,
  'clearvk_video': 0,
  'clearvk_audio': 0
};

// Own local storage
var ownLocalStorage = {}, localStorageManager = {
  set: function(name, value) {
    chrome.extension.sendRequest({type: 'set', name: name, value: value});
  },
  get: function(name) {
    chrome.extension.sendRequest({type: 'get', name: name}, function(response) {
      var value = (response == void 0) ? (idsOfOptions[name] || 1) : response;
      ownLocalStorage[name] = value;
    });
  },
  getAllSettings: function(anotherId) {
    for (var id in idsOfOptions)
      this.get(id);
    if (anotherId)
      this.get(anotherId);
  }
};
