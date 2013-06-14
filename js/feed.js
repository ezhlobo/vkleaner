var

	/**
	 * @return {Function} refreshPost
	 */
	nodeInserted = function( e ) {
		if ( isNewsPage() ) {
			var row = hata( e.target ).closest( ".feed_row" );

			if ( !row.attr( "vkleaner-types" ) ) {
				return refreshPost( row );
			}
		}
	},

	/**
	 * Show or hide hidden part of post
	 * @return {Object} row hata object of .feed_row
	 */
	openClicked = function( e ) {
		if ( hata( e.target ).closest( ".vkleaner-open" ).size() === 1 ) {
			var row = hata( e.target ).closest( ".feed_row" ),
				status = 0;

			if ( /display:\s?none/.test( row.find( ".post" ).attr( "style" ) ) ) {
				status = 2;
				row.find( ".vkleaner-open" ).html( localize_post_was_deleted );
			} else {
				status = parseInt( row.attr( "vkleaner-status" ) ) === 2 ? 1 : 2;
			}

			e.preventDefault();
			e.stopPropagation();

			return row.attr( "vkleaner-status", status );
		}
	},

	/**
	 * Refresh the VKleaner
	 *
	 * Set rowsBlock
	 * Set oldLocation
	 * Add DOM handlers
	 * Refresh every post
	 * Refresh style
	 */
	refresh = function() {
		selectUnwantedTypes();

		// Show vkleaner button
		chrome.extension.sendRequest({}, function( response ) {});

		rowsBlock = hata( "#feed_rows" );

		refreshEveryPost();
		refreshShowHeaderType();

		rowsBlock.unbind( "DOMNodeInserted", nodeInserted );
		rowsBlock.bind( "DOMNodeInserted", nodeInserted );
		rowsBlock.unbind( "click", openClicked );
		rowsBlock.bind( "click", openClicked );

		oldLocation = window.location.pathname + window.location.search;
	},

	locationTimer,
	locationInterval = 300,
	checkLocation = function() {
		if ( isLocationChanged() ) {
			if ( isNewsPage() ) {
				return refresh();
			}
			return oldLocation = window.location.pathname + window.location.search;
		}
	},

	firstInitialize = function() {
		checkLocation();
		return locationTimer = setInterval( checkLocation, locationInterval );
	};

hata.ready(function() {
	Storage.selectAll( firstInitialize );
});

Storage.onChanged(function( change ) {
	var name, value, optionName;

	for ( optionName in change ) {
		name = optionName;
		value = change[ optionName ];
	}

	if ( name === "clearvk_withLinks_content" ) {
		Storage.items[ "clearvk_withLinks_content" ] = value.newValue;
		return blacklistChanged();
	}

	if ( name === "clearvk_class" ) {
		Storage.items[ "clearvk_class" ] = value.newValue;
		return refreshShowHeaderType();
	}

	// else:

	var type = name.replace( /clearvk_/, "" );

	if ( value.newValue === 0 ) {
		var position = hata.inArray( type, unwantedTypes );

		unwantedTypes.splice( position, 1 );
	} else {
		unwantedTypes.push( type );
	}

	return optionsChanged( type );
});
