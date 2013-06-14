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
		var repostLink = post.find( ".published_by_date" );

		if ( repostLink.size() ) {
			return /^\/(wall|photo)-\d+/.test( repostLink.filter( "a" ).attr( "href" ) )
				|| /^(feed_reposts?)-\d+/.test( repostLink.closest( ".post" ).parent().attr( "class" ) );
		}
	},

	/**
	 * Is repost from user
	 */
	repostFromUsers: function( post ) {
		var repostLink = post.find( ".published_by_date" );

		if ( repostLink.size() ) {
			return /^\/(wall|photo)\d+/.test( repostLink.attr( "href" ) )
				|| /^(feed_reposts?)\d+/.test( repostLink.closest( ".post" ).parent().attr( "class" ) );
		}
	},

	/**
	 * Is post include links of blacklist
	 */
	withLinks: function( post ) {
		var mediaLink = post.find( ".lnk" ).find( ".a" ).text(),
			linkInText = hata.trim( unescape( post.find( ".wall_post_text" ).text() ) ),
			urlTpl = new RegExp( "(\s|^)(https?:\/\/)?(w{3}\.)?([^\s]+\.)?(" + links().join( "|" ).replace( ".", "\\." ) + ")(\/[^\s]*)?(\s|$)", "i" );

		return urlTpl.test( mediaLink ) || urlTpl.test( linkInText );
	},

	/**
	 * Is post include video
	 */
	withVideo: function( post ) {
		return post.find( ".wall_text a[href^=\"/video\"], a.page_post_thumb_video" ).size() > 0;
	},

	/**
	 * Is post include audio
	 */
	withAudio: function( post ) {
		return post.find( ".audio" ).size() > 0;
	},

	/**
	 * Is post about group
	 */
	groupShare: function( post ) {
		return post.find( ".group_share" ).size() > 0;
	},

	/**
	 * Is post by app
	 */
	fromApps: function( post ) {
		return post.find( ".wall_post_source_default" ).size() > 0;
	}

};
