localStorageManager.getAllSettings('clearvk_withLinks_content');

var hiding = {
  repostFromGroups: function(post) {
    var innerWrapClass = post.children().attr('class');
    if (innerWrapClass.substr(0, 11) == 'feed_repost') {
      // Group reposts from VKGroup
      if (innerWrapClass.substr(17, 1) == '-') {
        return true;
        post.find('.feed_reposts_more').addClass(cssClassForHiddenPosts + '-group');
      }
      // Repost from VKGroup or Photo-repost from VKGroup
      else if (innerWrapClass.substr(11, 1) == '-') {
        return true;
      }
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
    if (post.find('.page_media_video').length > 0)
      return true;
  },
  withAudio: function(post) {
    if (post.find('.audio').length > 0)
      return true;
  }
};

var contentBlock = $('#wrap3');
var hidePosts = function() {
  if (window.location.pathname != '/feed') return false;

  localStorageManager.getAllSettings('clearvk_withLinks_content');

  // Get new params for unwanted posts
  getParams();

  $('#feed_rows', contentBlock).find('.feed_row').each(function() {
    var post = $(this);
    var isUnwanted = false;

    // set isUnwanted = true if post is unwanted
    for (var name in needHide) if (isUnwanted = hiding[needHide[name]](post)) break;

    if (isUnwanted) {
      if (cssClassForHiddenPosts == 'clearvk-showTop') post.removeClass('clearvk-hideAll');
      post.addClass(cssClassForHiddenPosts);
    } else
      post.removeClass('clearvk-showTop clearvk-hideAll');
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
