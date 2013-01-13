/**
 * Refresh vkleaner-showheader
 * @return {Function}
 */
var refreshStyle = function() {
  return rowsBlock.attr('vkleaner-showheader', Storage.items['clearvk_class']);
};

/**
 * Refresh post status which vkleaner-types include changed option
 * @return {refreshPostStatus} Refresh post status of posts with changed option
 *   in vkleaner-types attr
 */
var optionsChanged = function(type) {
  return rowsBlock.find('.feed_row[vkleaner-types*=' + type + ']').each(function() {
    return refreshPostStatus( $(this) );
  });
};

/**
 * Refresh posts after blacklist changing
 * @return {refreshPost} Refresh not vkleaner and "withLinks" posts
 */
var blacklistChanged = function() {
  var rows = rowsBlock.find('.feed_row:not([vkleaner-types]), .feed_row[vkleaner-types*=withLinks]');
  return rows.each(function() {
    return refreshPost( $(this) );
  });
};

/**
 * Refresh the VKleaner
 *
 * Set rowsBlock
 * Add DOM handlers
 * Refresh every post
 * Refresh style
 */
var refresh = function() {
  selectUnwantedTypes();

  rowsBlock = $('#feed_rows');
  rowsBlock
    .off('.vkleaner')
    .on('click.vkleaner', '.vkleaner-open', openClicked)
    .on('DOMNodeInserted.vkleaner', function(e) {
      if (isNewsPage()) {
        var row = $(e.target).closest('.feed_row');
        if (!row.attr('vkleaner-types')) {
          refreshPost(row);
        }
      }
    });

  refreshEveryPost();
  refreshStyle();

  oldLocation = window.location.pathname + window.location.search;
};

/**
 * Show or hide a row after clicked the post
 */
var openClicked = function(e) {
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

var locationTimer, locationInterval = 300, checkLocation = function() {
  if (oldLocation !== window.location.pathname + window.location.search) {
    if (isNewsPage()) {
      return refresh();
    }
    return oldLocation = window.location.pathname + window.location.search;
  }
};

var firstInitialize = function() {
  checkLocation();
  return locationTimer = setInterval(checkLocation, locationInterval);
};

Storage.selectAll(firstInitialize);

Storage.onChanged(function(change) {
  var name, value;

  for (var key in change) {
    name = key;
    value = change[key];
  }

  switch (name) {
    case 'clearvk_withLinks_content':
      Storage.items['clearvk_withLinks_content'] = value.newValue;
      return blacklistChanged();
      break;

    case 'clearvk_class':
      Storage.items['clearvk_class'] = value.newValue;
      return refreshStyle();
      break;

    default:
      var type = name.replace(/clearvk_/, '');

      if (value.newValue === 0) {
        var position = $.inArray(type, unwantedTypes);
        unwantedTypes.splice(position, 1);
      } else {
        unwantedTypes[unwantedTypes.length] = type;
      }

      return optionsChanged(type);
  }
});
