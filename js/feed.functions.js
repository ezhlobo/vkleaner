var

	oldLocation,

	/** Array of unwanted types */
	unwantedTypes,

	/** Hata object of #feed_row */
	rowsBlock,

	/**
	 * @return {Array} unwantedTypes
	 */
	selectUnwantedTypes = function() {
		unwantedTypes = [];

		hata.each( Storage.items, function( value, key ) {
			if ( parseInt( value ) === 1 && key !== "clearvk_class" ) {
				unwantedTypes.push( key.replace( /clearvk_/, "" ) );
			}
		});

		return unwantedTypes;
	},

	/**
	 * @return {Boolean}
	 */
	isLocationChanged = function() {
		return oldLocation !== window.location.pathname + window.location.search;
	},

	newsUrlTemplate = /^\/feed|\/al_feed.php/,
	newsUrlExceptions = /photos|articles|notifications|comments|updates/,

	/**
	 * @return {Boolean}
	 */
	isNewsPage = function() {
		var url = window.location.pathname + window.location.search;

		return !newsUrlExceptions.test( url ) && newsUrlTemplate.test( url );
	},

	/**
	 * Refresh vkleaner-showheader
	 * @return {Object} rowsBlock
	 */
	refreshShowHeaderType = function() {
		return rowsBlock.attr( "vkleaner-showheader", Storage.items[ "clearvk_class" ] );
	},

	/**
	 * Refresh post status which vkleaner-types include changed option
	 * @return {Object} rowsBlock
	 */
	optionsChanged = function( type ) {
		return rowsBlock.find( ".feed_row[vkleaner-types*=" + type + "]" ).each(function() {
			refreshPostStatus( hata( this ) );
		});
	},

	/**
	 * Refresh posts after blacklist changing
	 * @return {Object} rows Not vkleaner and "withLinks" posts
	 */
	blacklistChanged = function() {
		var rows = rowsBlock.find( ".feed_row:not([vkleaner-types]), .feed_row[vkleaner-types*=withLinks]" );

		return rows.each(function() {
			refreshPost( hata( this ) );
		});
	},

	/**
	 * Init vkleaner to row or delete vkleaner of row
	 * @param  {Object}   row
	 * @return {Function} refreshPostStatus
	 */
	refreshPost = function( row ) {
		var name,
			types = [];

		for ( name in detect ) {
			if ( detect[ name ]( row ) ) {
				types.push( name );
			}
		}

		if ( types.length ) {
			row.attr( "vkleaner-types", types.join( " " ) );
			if ( row.find( ".vkleaner-open" ).size() === 0 ) {
				var openLinkText = localize_feed_openlink + " <b>" + row.find( ".author" ).text() + "</b>";

				row.prepend( "<a class='vkleaner-open' href=''>" + openLinkText + "</a>" );
			}

		} else {
			row.removeAttr( "vkleaner-types" ).find( ".vkleaner-open" ).remove();
		}

		return refreshPostStatus( row, types );
	},

	/**
	 * Refresh vkleaner-status value
	 * @param  {Object} row     Hata object of .feed_row
	 * @param  {Array}  [types] Array of vkleaner-types
	 * @return {Object} row
	 */
	refreshPostStatus = function( row, types ) {
		if ( !types ) {
			types = hata.trim( row.attr( "vkleaner-types" ) ).split( " " );
		}

		var length = types.length;

		if ( length ) {
			var status = 0,
				i = 0;

			for ( ; i < length; i++ ) {
				if ( hata.inArray( types[ i ], unwantedTypes ) !== -1 ) {
					status = 1;
					break;
				}
			}

			return row.attr( "vkleaner-status", status );
		} else {
			return row.removeAttr( "vkleaner-status" );
		}
	},

	/**
	 * Refresh posts
	 * @return {Object} rowsBlock
	 */
	refreshEveryPost = function() {
		return rowsBlock.find( ".feed_row:not([vkleaner-types])" ).each(function() {
			refreshPost( hata( this ) );
		});
	};
