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
        unwantedTypes[ unwantedTypes.length ] = key.replace(/clearvk_/, "");
      }
    });

    return unwantedTypes;
  },

  /**
   * @return {Boolean}
   */
  isLocationChanged = function() {
    return ( oldLocation !== window.location.pathname + window.location.search );
  },

  newsUrlTemplate = /^(\/feed|\/al_feed.php)(\?section=source&source=\d+|\?section=news)?$/,

  /**
   * @return {Boolean}
   */
  isNewsPage = function() {
    return newsUrlTemplate.test( window.location.pathname + window.location.search );
  },

  /**
   * Refresh vkleaner-showheader
   * @return {Object} rowsBlock
   */
  refreshShowHeaderType = function() {
    return rowsBlock.attr("vkleaner-showheader", Storage.items["clearvk_class"]);
  },

  /**
   * Refresh post status which vkleaner-types include changed option
   * @return {Object} rowsBlock
   */
  optionsChanged = function(type) {
    return rowsBlock.find(".feed_row[vkleaner-types*=" + type + "]").each(function() {
      refreshPostStatus( hata(this) );
    });
  },

  /**
   * Refresh posts after blacklist changing
   * @return {Object} rows Not vkleaner and "withLinks" posts
   */
  blacklistChanged = function() {
    var rows = rowsBlock.find(".feed_row:not([vkleaner-types]), .feed_row[vkleaner-types*=withLinks]");
    return rows.each(function() {
      refreshPost( hata(this) );
    });
  },

  /**
   * Init vkleaner to row or delete vkleaner of row
   * @param  {Object}   row
   * @return {Function} refreshPostStatus
   */
  refreshPost = function( row ) {
    var types = [];

    for ( var name in detect ) {
      if ( detect[ name ]( row ) ) {
        types[ types.length ] = name;
      }
    }

    if ( types.length > 0 ) {
      row.attr("vkleaner-types", types.join(" ") );
      if ( row.find(".vkleaner-open").size() == 0 ) {
        var openLinkText = localize_feed_openlink + " <b>" + row.find(".author").text() + "</b>";
        row.prepend("<a class=\"vkleaner-open\" href=\"\">" + openLinkText + "</a>");
      }

    } else {
      row.removeAttr("vkleaner-types").find(".vkleaner-open").remove();
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
      types = hata.trim( row.attr("vkleaner-types") ).split(" ");
    }

    var length = types.length;
    if ( length > 0 ) {
      var status = 0;

      for ( var i = 0; i < length; i++ ) {
        if ( hata.inArray( types[ i ], unwantedTypes ) !== -1 ) {
          status = 1;
          break;
        }
      }

      return row.attr("vkleaner-status", status );
    } else {
      return row.removeAttr("vkleaner-status");
    }
  },

  /**
   * Refresh posts
   * @return {Object} rowsBlock
   */
  refreshEveryPost = function() {
    return rowsBlock.find(".feed_row:not([vkleaner-types])").each(function() {
      refreshPost( hata(this) );
    });
  };
