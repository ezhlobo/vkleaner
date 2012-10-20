localStorageManager.getAllSettings('clearvk_withLinks_content');

var hiding = {
  repostFromGroups: function(post) {
    var innerWrapClass = post.children().attr('class');
    if (innerWrapClass.substr(0, 11) == 'feed_repost') {
      if (/^\/photo-[\d_]+$/.test($('a.published_by_date', post).attr('href')) || innerWrapClass.substr(17, 1) == '-' || innerWrapClass.substr(11, 1) == '-')
        return true;
    }
  },
  withLinks: function(post) {
    var mediaLink = post.find('.lnk .a').text();
    var linkInText = unescape(post.find('.wall_post_text').text());

    var urlTpl = new RegExp('(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+)?(' + links().join('|') + ')(\/[^\s]*)?', 'i');
    if (urlTpl.test(mediaLink) || urlTpl.test(linkInText))
      return true;
  },
  withVideo: function(post) {
    var walltext = post.find('.wall_text');
    if (post.find('.wall_text a[href^="/video"]').length > 0)
      return true;
  },
  withAudio: function(post) {
    if (post.find('.audio').length > 0)
      return true;
  },
  groupShare: function(post) {
    if (post.find('.group_share').length > 0)
      return true;
  }
};

var removeCssClass = function(post) {
  post
    .removeClass('clearvk-showTop clearvk-hideAll')
    .find('.feed_reposts_more').removeClass('clearvk-showTop-group clearvk-hideAll-group');
};

var addCssClass = function(post) {
  post
    .addClass(cssClassForHiddenPosts)
    .find('.feed_reposts_more').addClass(cssClassForHiddenPosts + '-group');
};

var checkEachPost = function() {
  // .feed_row
  var post = $(this);

  // Set isUnwanted = true if post is unwanted
  for (var name in needHide) if (isUnwanted = hiding[needHide[name]](post)) break;

  if (isUnwanted) {
    if (cssClassForHiddenPosts == 'clearvk-showTop') removeCssClass(post);
    addCssClass(post);
  } else { removeCssClass(post) }
};

var hidePosts = function(rows) {
  rows.each(checkEachPost);
};

var ifRowsWereChanged = function(rows) {
  return (rows.length != oldCount || rows.first().find('.post').attr('id') != oldFirstPostId || rows.last().find('.post').attr('id') != oldLastPostId) || false;
};

var ifOptionsWereChanged = function() {
  // If options items are not changed
  var is = (oldOptions !== void 0 && needHide.length == oldOptions.length);

  // If links are not changed
  var newLinks = links();
  if (is && oldLinks !== void 0 && newLinks.length == oldLinks.length) {
    $.each(newLinks, function(index, value) {
      if ($.inArray(value, oldLinks) == -1 ? true : false) return is = false;
    });
  }

  return !is;
};

var checkParams = function() {
  // Stop hiding if url is "/feed" or "/feed?section=source&source=userid"
  if (!/^\/feed(\?section=source&source=\d+)?$/.test(window.location.pathname + window.location.search)) return false;

  localStorageManager.getAllSettings('clearvk_withLinks_content');

  // Get new params for unwanted posts
  getParams();

  var rows = $('#feed_rows', contentBlock).find('.feed_row');

  if (ifRowsWereChanged(rows) || ifOptionsWereChanged() || oldCssClass != cssClassForHiddenPosts) {
    hidePosts(rows);

    oldOptions = needHide;
    oldLinks = links();
    oldCssClass = cssClassForHiddenPosts;
    oldCount = rows.length;
    oldFirstPostId = rows.first().find('.post').attr('id');
    oldLastPostId = rows.last().find('.post').attr('id');
  }
};

var getParams = function () {
  needHide = $.map(ownLocalStorage, function(value, key) {
    if (value == 1 && key != 'clearvk_class') return key.replace(/clearvk_/, '');
  });
  cssClassForHiddenPosts = (ownLocalStorage['clearvk_class'] == 1) ? 'clearvk-showTop' : 'clearvk-hideAll';
};

var initExtension = function() {
  getParams();

  // If extension was initialized
  if (ownLocalStorage['clearvk_repostFromGroups'] !== void 0) {
    clearInterval(initializing);

    setInterval(checkParams, 100);
  }
};

var oldOptions, oldLinks, oldCssClass, oldCount, oldFirstPostId, oldLastPostId;
var needHide, cssClassForHiddenPosts

var contentBlock = $('#page_body');
var initializing = setInterval(initExtension, 10);
