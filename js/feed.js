var

  /**
   * @return {Function} refreshPost
   */
  nodeInserted = function( e ) {
    if ( isNewsPage() ) {
      var row = hata(e.target).closest(".feed_row");
      if ( !row.attr("vkleaner-types") ) {
        return refreshPost( row );
      }
    }
  },

  /**
   * Show or hide hidden part of post
   * @return {Object} row hata object of .feed_row
   */
  openClicked = function( e ) {
    e.preventDefault();
    e.stopPropagation();

    if ( hata(e.target).closest(".vkleaner-open").size() === 1 ) {
      var row = hata(e.target).closest(".feed_row");

      var status = 0;
      if ( /display:\s?none/.test( row.find(".post").attr("style") ) ) {
        status = 2;
        row.find(".vkleaner-open").html(localize_post_was_deleted);
      } else {
        status = (parseInt(row.attr("vkleaner-status")) === 2) ? 1 : 2;
      }

      return row.attr("vkleaner-status", status );
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

    rowsBlock = hata("#feed_rows");

    rowsBlock.unbind("DOMNodeInserted", nodeInserted );
    rowsBlock.bind("DOMNodeInserted", nodeInserted );
    rowsBlock.unbind("click", openClicked );
    rowsBlock.bind("click", openClicked );

    refreshEveryPost();
    refreshShowHeaderType();

    oldLocation = window.location.pathname + window.location.search;
  },

  locationTimer,
  locationInterval = 300,
  checkLocation = function() {
    if ( oldLocation !== window.location.pathname + window.location.search ) {
      if ( isNewsPage() ) {
        return refresh();
      }
      return oldLocation = window.location.pathname + window.location.search;
    }
  },

  firstInitialize = function() {
    checkLocation();
    return locationTimer = setInterval(checkLocation, locationInterval);
  };

Storage.selectAll( firstInitialize );
Storage.onChanged(function( change ) {
  var name, value;

  for ( var key in change ) {
    name = key;
    value = change[ key ];
  }

  switch ( name ) {
    case "clearvk_withLinks_content":
      Storage.items["clearvk_withLinks_content"] = value.newValue;
      return blacklistChanged();
      break;

    case "clearvk_class":
      Storage.items["clearvk_class"] = value.newValue;
      return refreshShowHeaderType();
      break;

    default:
      var type = name.replace(/clearvk_/, "");

      if ( value.newValue === 0 ) {
        var position = hata.inArray( type, unwantedTypes );
        unwantedTypes.splice( position, 1);
      } else {
        unwantedTypes[ unwantedTypes.length ] = type;
      }

      return optionsChanged( type );
  }
});
