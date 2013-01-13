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
   * Is repost from user
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean} TRUE if post is repost from user
   */
  repostFromUsers: function(post) {
    var innerWrapClass = post.find('> div').attr('class');
    if (innerWrapClass && /^feed_repost\d+_\d+$/.test(innerWrapClass)) {
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

    var urlTpl = new RegExp('(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+\.)?(' + links().join('|') + ')(\/[^\s]*)?(\s|$)', 'i');
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
