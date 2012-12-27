var optionsBlock, wrapBlock;

$(function() {
  wrapBlock = $('#wrap');
  optionsBlock = $('.options');

  wrapBlock.on('change', '.option input', changeOptionStatus);

  localization();

  modalBlacklist('#clearvk_withLinks a');

  setDefaultSettings();
});

var modalBlacklist = function(element) {
  var animateDuration = 200;

  var background = $('body').append('<div class="background"></div>').find('> .background');

  background.display = function(value) {
    return this.animate({opacity: value}, animateDuration);
  };

  var open = function(e) {
    e.preventDefault();
    background.display('show').css({ width: $(document).width(), height: $(document).height() });
    $('#notifier')
      .animate({opacity: 'show', top: 20}, animateDuration)
      .find('.notifier textarea')
        .val(links(localStorage.getItem('clearvk_withLinks_content')).join('\n'));
  };

  var hide = function() {
    background.display('hide');
    $('#notifier')
      .animate({opacity: 'hide', top: 0}, animateDuration);
  };

  var saveContent = function() {
    var arrayOfContent = $('#notifier textarea').val().trim().split('\n');
    var value = cleanArray(arrayOfContent).join(';');
    localStorage.setItem('clearvk_withLinks_content', value);
    hide();
  };

  wrapBlock
    .on('click', element, open)
    .on('click', '#notifier button', saveContent);
  background.hide().on('click', hide);
};

var enableOption = function(optionId, firstInit) {
  var option = $('#' + optionId, optionsBlock);
  option.addClass('yes');
  if (firstInit) {
    option.find('input').prop('checked', 'checked');
  }
  localStorage.setItem(optionId, 1);
};

var disableOption = function(optionId) {
  $('#' + optionId, optionsBlock).removeClass('yes');
  localStorage.setItem(optionId, 0);
};

var setDefaultSettings = function() {
  for (var optionId in localStorage) {
    if (parseInt(localStorage[optionId]) === 1)
      enableOption(optionId, true);
  }
};

// Change option (yes or now)
var changeOptionStatus = function() {
  var input = $(this);
  var optionId = input.attr('name');

  if (input.is(':checked')) {
    enableOption(optionId);
  } else {
    disableOption(optionId);
  }
};

var localization = function() {
  var localize_options = localize('options');
  var localize_yes = localize('options_yes');
  var notifierContent = '<div class="notifier"><p class="title">' + localize('options_toRestore') + '</p><textarea></textarea></div><button>' + localize('options_save') + '</button>';

  // Localize title of page
  $('title').html($('title').html() + localize_options);

  wrapBlock
    // Localize header
    .find('h1').html($('h1').html() + localize_options).end()

    // Localize description
    .find('.description p').html(localize('options_description')).end()

    // Localize checkbox of option
    .find('.option label').each(function() {
      $(this).html(localize_yes + $(this).html());
    }).end()

    // Localize content of option
    .find('.option').each(function() {
      var option = $(this);
      var nameOfOption = option.attr('id').replace('clearvk', '');
      $('.name', option).html(localize('options' + nameOfOption));
    }).end()

    // Localize content of notification
    .find('#notifier').html(notifierContent);
};
