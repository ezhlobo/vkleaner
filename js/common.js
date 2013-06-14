var

	/**
	 * @param  {String} query
	 * @return {String}
	 */
	localize = function( query ) {
		return chrome.i18n.getMessage( query );
	},

	localize_options = localize( "options" ),
	localize_yes = localize( "options_yes" ),
	localize_feed_openlink = localize( "feed_openlink" ),
	localize_post_was_deleted = localize( "post_was_deleted" ),

	/**
	 * Default content of blacklist
	 */
	defaultBlacklist = [
		"ask.fm",
		"sprashivai.ru",
		"formspring.me",
		"my-truth.ru",
		"askbook.me",
		"askme.by",
		"qroom.ru",
		"nekto.me",
		"sprashivai.by",
		"vopros.me",
		"voprosmne.ru",
		"sprashivalka.com",
		"askbook.me",
		"my-truth.ru"
	],

	/**
	 * Remove empty elements from an array
	 * @param  {Array} array
	 * @return {Array}
	 */
	cleanArray = function( array ) {
		var newArray = new Array(),
			i = 0,
			l = array.length;

		for ( ; i < l; i++ ) {
			if ( array[ i ] ) {
				newArray.push( array[ i ] );
			}
		}

		return newArray;
	},

	/**
	 * Get current blacklist content
	 * @return {Array}
	 */
	links = function() {
		var links = Storage.items[ "clearvk_withLinks_content" ];

		return links === undefined ? [] : links === "clearvk_withLinks_content" ? defaultBlacklist : cleanArray( links.split( ";" ) );
	},

	/**
	 * Option's names and default values
	 */
	idsOfOptions = {
		"clearvk_class": 1,
		"clearvk_repostFromGroups": 1,
		"clearvk_repostFromUsers": 0,
		"clearvk_withLinks": 0,
		"clearvk_withVideo": 0,
		"clearvk_withAudio": 0,
		"clearvk_groupShare": 0,
		"clearvk_eventShare": 0,
		"clearvk_fromApps": 0
	},

	idsOfOptionsKeys = [ "clearvk_withLinks_content" ];

for ( /*DON'T MAKE `optionName` GLOBAL*/ var optionName in idsOfOptions ) {
	idsOfOptionsKeys.push( optionName );
}
