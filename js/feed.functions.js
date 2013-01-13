var oldLocation;

/** Array of unwanted types */
var unwantedTypes;

/** Jquery object of #feed_row */
var rowsBlock;

/**
 * Is location changed
 * @return {Boolean}
 */
var isLocationChanged = function() {
  return (oldLocation !== window.location.pathname + window.location.search);
};

var newsUrlTemplate = /^(\/feed|\/al_feed.php)(\?section=source&source=\d+|\?section=news)?$/;

/**
 * Is user at news page
 * @return {Boolean}
 */
var isNewsPage = function() {
  return newsUrlTemplate.test(window.location.pathname + window.location.search);
};

/**
 * Selecting unwanted types
 * @return {Array} unwantedTypes
 */
var selectUnwantedTypes = function() {
  return unwantedTypes = $.map(Storage.items, function(value, key) {
    if (parseInt(value) === 1 && key !== 'clearvk_class') {
      return key.replace(/clearvk_/, '');
    }
  });
};

/**
 * Init vkleaner to row or delete vkleaner of row
 * @param  {jQuery Object} row jQuery object of .feed_row
 * @return {refreshPostStatus} Refresh status after rows refreshing
 */
var refreshPost = function(row) {
  var types = [];

  for (var name in hiding) {
    if (hiding[name](row)) {
      types[types.length] = name;
    }
  }

  if (types.length > 0) {
    row.attr('vkleaner-types', types.join(' '));
    if (row.find('.vkleaner-open').length == 0) {
      var openLinkText = localize_feed_openlink + ' <b>' + row.find('.author:first').text() + '</b>';
      row.prepend('<a class="vkleaner-open" href="">' + openLinkText + '</a>');
    }
  } else {
    row.removeAttr('vkleaner-types').find('.vkleaner-open').remove();
  }

  return refreshPostStatus(row, types);
};

/**
 * Refresh vkleaner-status value
 * @param  {jQuery Object} row  jQuery object of .feed_row
 * @param  {Array} types        Array of vkleaner-types
 */
var refreshPostStatus = function(row, types) {
  if (!types) {
    types = $.trim(row.attr('vkleaner-types')).split(' ');
  }

  var length = types.length;
  if (length > 0) {
    var status = 0;

    for (var i = 0; i < length; i++) {
      if ($.inArray(types[i], unwantedTypes) !== -1) {
        status = 1;
        break;
      }
    }

    return row.attr('vkleaner-status', status);
  } else {
    return row.removeAttr('vkleaner-status');
  }
};

/**
 * Refresh posts
 * @return {refreshPost} Refresh not vkleaner posts
 */
var refreshEveryPost = function() {
  return rowsBlock.find('.feed_row:not([vkleaner-types])').each(function() {
    return refreshPost( $(this) );
  });
};
