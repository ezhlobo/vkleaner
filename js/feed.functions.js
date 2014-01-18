var
	oldLocation, unwantedTypes, rowsBlock,

	newsUrlTemplate = /^(\/feed|\/al_feed.php)/,
	newsUrlExceptions = /photos|articles|notifications|comments|updates/,

	refreshShowHeaderType = function() {
		return rowsBlock.attr( "vkleaner-showheader", Storage.items[ "clearvk_class" ] );
	},

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

	refreshEveryPost = function() {
		return rowsBlock.find( ".feed_row:not([vkleaner-types])" ).each(function() {
			refreshPost( hata( this ) );
		});
	},

	optionsChanged = function( type ) {
		return rowsBlock.find( ".feed_row[vkleaner-types*=" + type + "]" ).each(function() {
			refreshPostStatus( hata( this ) );
		});
	},

	blacklistChanged = function() {
		var rows = rowsBlock.find( ".feed_row:not([vkleaner-types]), .feed_row[vkleaner-types*=withLinks]" );

		return rows.each(function() {
			refreshPost( hata( this ) );
		});
	},

	selectUnwantedTypes = function() {
		unwantedTypes = [];

		hata.each( Storage.items, function( value, key ) {
			if ( parseInt( value ) === 1 && key !== "clearvk_class" ) {
					unwantedTypes.push( key.replace( /clearvk_/, "" ) );
			}
		});

		return unwantedTypes;
	},

	getUrl = function() {
		return window.location.pathname + window.location.search;
	},

	isLocationChanged = function() {
		return oldLocation !== getUrl();
	},

	isNewsPage = function() {
		var url = getUrl();

		return !newsUrlExceptions.test( url ) && newsUrlTemplate.test( url );
	};
