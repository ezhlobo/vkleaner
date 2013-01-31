/**
 * Detectors of unwanted posts
 * @class
 */
var detect = {

  /**
   * Is repost from group
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post is repost from group
   */
  repostFromGroups: function(post) {
    var repostLink = post.find('.published_by_date');
    if (repostLink.length) {
      return false
        || /^\/(wall|photo)-\d+/.test(repostLink.filter('a').attr('href'))
        || /^(feed_reposts?)-\d+/.test(repostLink.closest('.post').parent().attr('class'));
    }
  },

  /**
   * Is repost from user
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post is repost from user
   */
  repostFromUsers: function(post) {
    var repostLink = post.find('.published_by_date');
    if (repostLink.length) {
      return false
        || /^\/(wall|photo)\d+/.test(repostLink.attr('href'))
        || /^(feed_reposts?)\d+/.test(repostLink.closest('.post').parent().attr('class'));
    }
  },

  /**
   * Is post include links of blacklist
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post include links of blacklist
   */
  withLinks: function(post) {
    var mediaLink = post.find('.lnk .a').text();
    var linkInText = unescape(post.find('.wall_post_text').text());

    /**
     * Url template
     * @type {RegExp}
     *
     * [space or beggining of the line] REQUIRED
     * http:// [or] https://            NOT REQUIRED
     * www.                             NOT REQUIRED
     * [any non-space symbols]          NOT REQUIRED
     * [links of blacklist]             REQUIRED
     * / [and any non-space symbols]    NOT REQUIRED
     * [space or end of the line]       REQUIRED
     */
    var urlTpl = new RegExp('(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+\.)?(' + links().join('|') + ')(\/[^\s]*)?(\s|$)', 'i');

    if (urlTpl.test(mediaLink) || urlTpl.test(linkInText)) {
      return true;
    }
  },

  /**
   * Is post include video
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post include video
   */
  withVideo: function(post) {
    if (post.find('.wall_text a[href^="/video"], a.page_post_thumb_video').length > 0) {
      return true;
    }
  },

  /**
   * Is post include audio
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post include audio
   */
  withAudio: function(post) {
    if (post.find('.audio').length > 0) {
      return true;
    }
  },

  /**
   * Is post about group
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post about group
   */
  groupShare: function(post) {
    if (post.find('.group_share').length > 0) {
      return true;
    }
  },

  /**
   * Is post by app
   * @param  {jQuery Object} post jQuery object of .feed_row
   * @return {Boolean}            TRUE if post by app
   */
  fromApps: function(post) {
    if (post.find('.wall_post_source_default').length > 0) {
      return true;
    }
  }
};
