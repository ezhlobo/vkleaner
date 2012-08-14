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
  var links = ownLocalStorage['clearvk_withLinks_content'];
  return links ? links.toString().split(linksSeparator) : defaultBlacklist;
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
  getOptions: function(name) {
    chrome.extension.sendRequest({type: 'get', name: name}, function(response) {
      var value = response === null ? idsOfOptions[name] : response;
      ownLocalStorage[name] = parseInt(value);
    });
  },
  getStatus: function() {
    chrome.extension.sendRequest({type: 'get', name: 'clearvk_status'}, function(response) {
      var value = response === null ? 1 : response;
      ownLocalStorage['clearvk_status'] = value;
    });
  },
  get: function(name) {
    chrome.extension.sendRequest({type: 'get', name: name}, function(response) {
      var value = response === null ? links().join('\n') : response;
      ownLocalStorage[name] = value;
    });
  },
  getAllSettings: function(anotherId) {
    for (var id in idsOfOptions)
      this.getOptions(id);
    if (anotherId)
      this.get(anotherId);
  },
};
