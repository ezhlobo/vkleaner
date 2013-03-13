/**
 * Detectors of unwanted posts
 *
 * @param  {Object}  post Hata object of .feed_row
 * @return {Boolean}
 */
var detect = {

  /**
   * Is repost from group
   */
  repostFromGroups: function( post ) {
    var repostLink = post.find(".published_by_date");
    if ( repostLink.size() ) {
      return false
        || /^\/(wall|photo)-\d+/.test( repostLink.filter("a").attr("href") )
        || /^(feed_reposts?)-\d+/.test( repostLink.closest(".post").parent().attr("class") );
    }
  },

  /**
   * Is repost from user
   */
  repostFromUsers: function( post ) {
    var repostLink = post.find(".published_by_date");
    if ( repostLink.size() ) {
      return false
        || /^\/(wall|photo)\d+/.test( repostLink.attr("href") )
        || /^(feed_reposts?)\d+/.test( repostLink.closest(".post").parent().attr("class") );
    }
  },

  /**
   * Is post include links of blacklist
   */
  withLinks: function( post ) {
    var mediaLink = post.find(".lnk .a").text();
    var linkInText = unescape( post.find(".wall_post_text").text() );
    var urlTpl = new RegExp("(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+\.)?(" + links().join("|") + ")(\/[^\s]*)?(\s|$)", "i");

    if ( urlTpl.test( mediaLink ) || urlTpl.test( linkInText ) ) {
      return true;
    }
  },

  /**
   * Is post include video
   */
  withVideo: function( post ) {
    if ( post.find(".wall_text a[href^=\"/video\"], a.page_post_thumb_video").size() > 0 ) {
      return true;
    }
  },

  /**
   * Is post include audio
   */
  withAudio: function( post ) {
    if ( post.find(".audio").size() > 0 ) {
      return true;
    }
  },

  /**
   * Is post about group
   */
  groupShare: function( post ) {
    if ( post.find(".group_share").size() > 0 ) {
      return true;
    }
  },

  /**
   * Is post by app
   */
  fromApps: function( post ) {
    if ( post.find(".wall_post_source_default").size() > 0 ) {
      return true;
    }
  }

};
