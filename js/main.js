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

var cleanArray = function(array) {
  var newArray = new Array();
  for(var i = 0; i < array.length; i++)
    if (array[i]) newArray.push(array[i]);
  return newArray;
}

var linksSeparator = ';';
var links = function() {
  var links = ownLocalStorage['clearvk_withLinks_content'];
  return links == 'clearvk_withLinks_content' ? defaultBlacklist : cleanArray(links.split(linksSeparator));
};

// Ids of options and their default values
var idsOfOptions = {
  'clearvk_class': 1,
  'clearvk_repostFromGroups': 1,
  'clearvk_withLinks': 1,
  'clearvk_withVideo': 0,
  'clearvk_withAudio': 0,
  'clearvk_groupShare': 0
};

// Own local storage
var ownLocalStorage = {}, localStorageManager = {
  set: function(name, value) {
    chrome.extension.sendRequest({type: 'set', name: name, value: value});
  },
  get: function(name) {
    chrome.extension.sendRequest({type: 'get', name: name}, function(response) {
      var value;
      if (response === null || response == '')
        value = (idsOfOptions[name] === void 0) ? name : idsOfOptions[name];
      else
        value = response;
      ownLocalStorage[name] = value;
    });
  },
  getAllSettings: function(anotherId) {
    for (var id in idsOfOptions)
      this.get(id);
    if (anotherId)
      this.get(anotherId)
  }
};
