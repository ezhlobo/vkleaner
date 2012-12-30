ownLocalStorage.selectAll();

/**
 * Init vkleaner to row or delete vkleaner of row
 * @param  {jQuery Object} row jQuery object of .feed_row
 * @return {refreshPostStatus} Refresh status after rows refreshing
 */
var refreshPost = function(row) {
  var types = [];

  for (var name in hiding) {
    if (hiding[name](row)) {
      types.push(name);
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
 * @param  {jQuery Object} row jQuery object of .feed_row
 * @param  {Array} [types] Array of vkleaner-types
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

    row.attr('vkleaner-status', status);
  } else {
    row.removeAttr('vkleaner-status');
  }
};

/**
 * Which option has been changed
 * @param  {Array} what  Value of this types would be checked
 * @param  {Array} where
 * @return {String} Name of changed option
 */
var whatOptionWasChanged = function(what, where) {
  for (var i = 0, l = what.length; i < l; i++) {
    if ($.inArray(what[i], where) === -1) {
      return what[i];
      break;
    }
  }
};

/**
 * Refresh posts
 * @return {refreshPost} Refresh not vkleaner posts
 */
var refreshEveryPost = function() {
  rowsBlock.find('.feed_row:not([vkleaner-types])').each(function() {
    refreshPost($(this));
  });
};

/**
 * Refresh post status which vkleaner-types include changed option
 * @return {refreshPostStatus} Refresh post status of posts with changed option
 *   in vkleaner-types attr
 */
var optionsChanged = function() {
  if (oldOptions !== undefined) {
    var type = '';
    if (oldOptions.length > unwantedTypes.length) {
    // option has been removed
      type = whatOptionWasChanged(oldOptions, unwantedTypes);
    } else {
    // option has been added
      type = whatOptionWasChanged(unwantedTypes, oldOptions);
    }

    rowsBlock.find('.feed_row[vkleaner-types*=' + type + ']').each(function() {
      refreshPostStatus($(this));
    });
  }
};

/**
 * Refresh posts after blacklist changing
 * @return {refreshPost} Refresh not vkleaner and "withLinks" posts
 */
var blacklistChanged = function() {
  var rows = rowsBlock.find('.feed_row:not([vkleaner-types]), .feed_row[vkleaner-types*=withLinks]');
  rows.each(function() {
    refreshPost($(this));
  });
};

/**
 * Refresh vkleaner-showheader
 * @return {Function}
 */
var refreshStyle = function() {
  rowsBlock.attr('vkleaner-showheader', ownLocalStorage.items['clearvk_class']);
};

/**
 * Start or stop vkleaner after location changing
 * @return {Function}
 */
var checkLocation = function() {
  if (isNewsPage()) {
    refresh();
    bind.start();
  } else {
    bind.stop();
  }
};

/**
 * Show or hide a row after clicking the post
 * @return {Boolean} FALSE
 */
var openRow = function() {
  var row = $(this).closest('.feed_row');
  var status = 0;
  if (/display:\s?none/.test(row.find('.post').attr('style'))) {
    status = 2;
    row.find('.vkleaner-open').html(localize_post_was_deleted);
  } else {
    status = (parseInt(row.attr('vkleaner-status')) === 2) ? 1 : 2;
  }
  row.attr('vkleaner-status', status);
  return false;
};

/**
 * Refresh the VKleaner
 *
 * <p>Set rowsBlock</p>
 * <p>Add DOM handlers</p>
 */
var refresh = function() {
  rowsBlock = $('#feed_rows');
  rowsBlock
    .off('.vkleaner')
    .on('click.vkleaner', '.vkleaner-open', openRow)
    .on('DOMNodeInserted.vkleaner', function(event) {
      if (isNewsPage()) {
        var row = $(event.target).closest('.feed_row');
        if (!row.attr('vkleaner-types')) {
          refreshPost(row);
        }
      }
    });

  refreshEveryPost();
  refreshStyle();
  oldOptions = unwantedTypes;
  oldLinks = links();
  oldCssClass = ownLocalStorage.items['clearvk_class'];
  oldLocation = window.location.pathname + window.location.search;
};

bind.setChecks({
  options: optionsChanged,
  blacklist: blacklistChanged,
  style: refreshStyle,
  location: checkLocation
});

/**
 * Initializing extension when the own local storage will be ready
 *
 * <p>Select unwanted types to unwantedTypes</p>
 * <p>Refresh if user at news page</p>
 * <p>Add bind to chech location</p>
 */
var firstInitialize = function() {
  if (isLocalStorageReady()) {
    clearInterval(initializing);

    selectUnwantedTypes();

    checkLocation();
    bind.checkLocation();
  }
};

var initializing = setInterval(firstInitialize, 10);
