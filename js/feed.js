var
	refresh = function() {
		// Load options to 'unwantedTypes' variable
		selectUnwantedTypes();

		// Show vkleaner button
		chrome.extension.sendRequest({}, function() {});

		rowsBlock = hata( "#feed_rows" );

		refreshEveryPost();
		refreshShowHeaderType();

		// Catch new post
		rowsBlock.unbind( "DOMNodeInserted", refreshNewPost );
		rowsBlock.bind( "DOMNodeInserted", refreshNewPost );

		// Click on post header
		rowsBlock.unbind( "click", clickOnHidedPost );
		rowsBlock.bind( "click", clickOnHidedPost );
	},

	refreshNewPost = function( e ) {
		if ( isNewsPage() ) {
			var row = hata( e.target ).closest( ".feed_row" );

			if ( !row.attr( "vkleaner-types" ) ) {
				return refreshPost( row );
			}
		}
	},

	clickOnHidedPost = function( e ) {
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

	locationTimer,
	locationInterval = 100,
	checkLocation = function() {
		if ( isLocationChanged() ) {
			if ( isNewsPage() ) {
				refresh();
			}

			return oldLocation = getUrl();
		}
	},

	firstInitialize = function() {
		checkLocation();

		return locationTimer = setInterval( checkLocation, locationInterval );
	},

	firstDomLoaded = function() {
		return Storage.selectAll( firstInitialize );
	},

	storageChanged = function( change ) {
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
	};

hata.ready( firstDomLoaded );
Storage.onChanged( storageChanged );
