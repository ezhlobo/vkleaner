localStorageManager.getAllSettings('clearvk_withLinks_content');

var hiding = {
  repostFromGroups: function(post) {
    var innerWrapClass = post.children().attr('class');
    // Reposts && (Group reposts from VKGroup || Reposts from VKGroup or Photo-reposts from VKGroup)
    if (innerWrapClass.substr(0, 11) == 'feed_repost' && (innerWrapClass.substr(17, 1) == '-' || innerWrapClass.substr(11, 1) == '-'))
      return true;
  },
  withLinks: function(post) {
    var mediaLink = post.find('.lnk .a').text();
    var linkInText = unescape(post.find('.wall_post_text').text());

    var urlTpl = new RegExp('(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+)?(' + links().join('|') + ')(\/[^\s]*)?', 'i');
    if (urlTpl.test(mediaLink) || urlTpl.test(linkInText))
      return true;
  },
  withVideo: function(post) {
    if (post.find('.page_media_video').length > 0)
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

var contentBlock = $('#page_body');
var hidePosts = function() {
  var location = window.location;
  if (!/^\/feed(\?section=source&source=\d+)?$/.test(location.pathname + location.search)) return false;

  localStorageManager.getAllSettings('clearvk_withLinks_content');

  // Get new params for unwanted posts
  getParams();

  $('#feed_rows', contentBlock).find('.feed_row').each(function() {
    var post = $(this);
    var isUnwanted = false;

    // set isUnwanted = true if post is unwanted
    for (var name in needHide) if (isUnwanted = hiding[needHide[name]](post)) break;

    if (isUnwanted) {
      if (cssClassForHiddenPosts == 'clearvk-showTop') removeCssClass(post);
      addCssClass(post);
    } else
      removeCssClass(post);
  });
};

var needHide, cssClassForHiddenPosts, getParams = function () {
  needHide = [];
  if (ownLocalStorage['clearvk_repostFromGroups'] == 1)
    needHide.push('repostFromGroups');
  if (ownLocalStorage['clearvk_withLinks'] == 1)
    needHide.push('withLinks');
  if (ownLocalStorage['clearvk_video'] == 1)
    needHide.push('withVideo');
  if (ownLocalStorage['clearvk_audio'] == 1)
    needHide.push('withAudio');
  if (ownLocalStorage['clearvk_groupShare'] == 1)
    needHide.push('groupShare');

  cssClassForHiddenPosts = (ownLocalStorage['clearvk_class'] == 1) ? 'clearvk-showTop' : 'clearvk-hideAll';
};

var initExtension = function() {
  getParams();

  // If extension was running
  if (ownLocalStorage['clearvk_repostFromGroups'] !== void 0) {
    clearInterval(running);
    setInterval(hidePosts, 100);
    hidePosts();
  }
};

var running = setInterval(initExtension, 10);
