var oldOptions, oldLinks, oldCssClass, oldLocation;

/** Array of unwanted types */
var unwantedTypes;

/** Jquery object of #feed_row */
var rowsBlock;

/**
 * Detectors of unwanted posts
 * @class
 */
var hiding = {
  /**
   * Is repost from group
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post is repost from group
   */
  repostFromGroups: function(post) {
    var innerWrapClass = post.children().attr('class');
    if (innerWrapClass && innerWrapClass.substr(0, 11) === 'feed_repost') {
      if (/^\/photo-[\d_]+$/.test($('a.published_by_date', post).attr('href')) || innerWrapClass.substr(17, 1) == '-' || innerWrapClass.substr(11, 1) == '-')
        return true;
    }
  },
  /**
   * Is post include links of blacklist
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post include links of blacklist
   */
  withLinks: function(post) {
    var mediaLink = post.find('.lnk .a').text();
    var linkInText = unescape(post.find('.wall_post_text').text());

    var urlTpl = new RegExp('(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+)?(' + links().join('|') + ')(\/[^\s]*)?', 'i');
    if (urlTpl.test(mediaLink) || urlTpl.test(linkInText))
      return true;
  },
  /**
   * Is post include video
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post include video
   */
  withVideo: function(post) {
    var walltext = post.find('.wall_text');
    if (post.find('.wall_text a[href^="/video"], a.page_post_thumb_video').length > 0)
      return true;
  },
  /**
   * Is post include audio
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post include audio
   */
  withAudio: function(post) {
    if (post.find('.audio').length > 0)
      return true;
  },
  /**
   * Is post about group
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post about group
   */
  groupShare: function(post) {
    if (post.find('.group_share').length > 0)
      return true;
  },
  /**
   * Is post by app
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post by app
   */
  fromApps: function(post) {
    if (post.find('.wall_post_source_default').length > 0)
      return true;
  }
};

/**
 * Is options (connected with posts and not content of blacklist) changed
 * @return {Boolean}
 */
var isOptionsChanged = function() {
  return !(oldOptions !== undefined && unwantedTypes.length === oldOptions.length);
};

/**
 * Is blacklist value changed
 * @return {Boolean}
 */
var isBlacklistChanged = function() {
  var is = false;
  var newLinks = links();
  if (oldLinks !== undefined && newLinks.length === oldLinks.length) {
    for (var i = 0, l = newLinks.length; i < l; i++) {
      if ($.inArray(newLinks[i], oldLinks) === -1) {
        is = true;
        break;
      }
    }
  } else {
    is = true;
  }
  return is;
};

/**
 * Is style changed
 * @return {Boolean}
 */
var isStyleChanged = function() {
  return (ownLocalStorage['clearvk_class'] !== oldCssClass);
};

/**
 * Is location changed
 * @return {Boolean}
 */
var isLocationChanged = function() {
  return (oldLocation !== window.location.pathname + window.location.search);
};

/**
 * Is user at news page
 * @return {Boolean}
 */
var isNewsPage = function() {
  return newsUrlTemplate.test(window.location.pathname + window.location.search);
};
var newsUrlTemplate = /^(\/feed|\/al_feed.php)(\?section=source&source=\d+|\?section=news)?$/;

/**
 * Is own local storage ready
 * @return {Boolean}
 */
var isLocalStorageReady = function() {
  return ownLocalStorage['clearvk_withLinks_content'] !== undefined;
};

/**
 * Selecting unwanted types
 * @return {Array} unwantedTypes
 */
var selectUnwantedTypes = function() {
  return unwantedTypes = $.map(ownLocalStorage, function(value, key) {
    if (parseInt(value) === 1 && key !== 'clearvk_class') return key.replace(/clearvk_/, '');
  });
};

/**
 * Create own bind function
 * @class
 */
var bind = function() {
  var bind = {}, timer, timerLocation, interval = 350;

  /** @param {Object} checks Object of callbacks */
  bind.setChecks = function(checks) {
    bind._checks = checks;
  };

  /** @public */
  bind.start = function() {
    timer = setInterval(bind._checking, interval);
  };

  /** @public */
  bind.checkLocation = function() {
    timerLocation = setInterval(bind._checkLocation, interval);
  };

  /** @public */
  bind.stop = function() {
    clearInterval(timer);
  };

  /** @public */
  bind._checkLocation = function() {
    if (isLocationChanged()) {
      bind._checks.location();

      oldLocation = window.location.pathname + window.location.search;
    }
  };

  /** @public */
  bind._checking = function() {
    var rows = rowsBlock.find('.feed_row');

    localStorageManager.getAllSettings('clearvk_withLinks_content');
    selectUnwantedTypes();

    if (isOptionsChanged()) {
      bind._checks.options();

      oldOptions = unwantedTypes;
    }

    if (isBlacklistChanged()) {
      bind._checks.blacklist();

      oldLinks = links();
    }

    if (isStyleChanged()) {
      bind._checks.style();

      oldCssClass = ownLocalStorage['clearvk_class'];
    }
  };

  return bind;
}();
