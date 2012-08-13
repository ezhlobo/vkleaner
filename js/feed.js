localStorageManager.getAllSettings('clearvk_withLinks_content');

var hide = function(post) {
  post.addClass(cssClassForHiddenPosts);
};

var hiding = {
  repostFromGroups: function(post) {
    var innerWrapClass = post.children().attr('class');
    if (innerWrapClass.substr(0, 11) == 'feed_repost') {
      // Group reposts from VKGroup
      if (innerWrapClass.substr(17, 1) == '-') {
        hide(post);
        post.find('.feed_reposts_more').addClass(cssClassForHiddenPosts + '-group');
      }
      // Repost from VKGroup or Photo-repost from VKGroup
      else if (innerWrapClass.substr(0, 11) == 'feed_repost' || post.find('a.published_by_date').attr('href').substr(6, 1) == '-') {
        hide(post);
      }
    }
  },
  withLinks: function(post) {
    var mediaLink = post.find('.lnk .a').text();
    var linkInText = unescape(post.find('.wall_post_text').text());

    var urlTpl = new RegExp('(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+)?(' + links().join('|') + ')(\/[^\s]*)?', 'i');
    if (urlTpl.test(mediaLink) || urlTpl.test(linkInText))
      hide(post);
  },
  withVideo: function(post) {
    if (post.find('.page_media_video').length > 0)
      hide(post);
  },
  withAudio: function(post) {
    if (post.find('.audio').length > 0)
      hide(post);
  }
};

var hidePosts = function() {
  if (window.location.pathname != '/feed') return false;

  localStorageManager.getAllSettings('clearvk_withLinks_content');

  // Get new params for unwanted posts
  getParams();

  $('#feed_rows').find('.feed_row').removeClass('clearvk-showTop clearvk-hideAll').each(function(){
    for (var name in needHide)
      hiding[needHide[name]]($(this));
  });
};

var needHide, getParams = function () {
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
}, cssClassForHiddenPosts;

var initExtension = function() {
  getParams();

  // If extension was running
  if (ownLocalStorage['clearvk_status'] == 1) {
    clearInterval(running);
    setInterval(hidePosts, 100);
    hidePosts();
  }
};

localStorageManager.get('clearvk_status');
var running = setInterval(initExtension, 10);
