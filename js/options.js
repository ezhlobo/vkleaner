$(function() {
  $('#wrap').on('change', '.option input', changeOptionStatus);

  localization();

  modalBlacklist('#clearvk_withLinks a');

  setDefaultSettings();
});

var modalBlacklist = function(element) {
  var animateDuration = 200;

  var background = $('body').append('<div class=\'background\'></div>').find('.background');
  background.display = function(value) {
    this.animate({opacity: value}, animateDuration);
  };

  localStorage.getItem('clearvk_withLinks_content');

  var open = function() {
    background.css({ width: $(document).width(), height: $(document).height() }).display('show');
    $('#notifier')
      .animate({opacity: 'show', top: '20px'}, animateDuration)
      .find('.notifier').html('<p class=\'title\'>' + localize('options_toRestore') + '</p><textarea>' + links().join('\n') + '</textarea>');
    return false;
  };
  var hide = function() {
    background.display('hide');
    $('#notifier').animate({opacity: 'hide', top: '0'}, animateDuration);
    return false;
  };

  var saveContent = function() {
    var value = cleanArray($('#notifier textarea').val().trim().split('\n')).join(';');
    localStorage.setItem('clearvk_withLinks_content', value);
    localStorage.getItem('clearvk_withLinks_content');
    hide();
  };

  $('#wrap').on('click', element, open).on('click', '#notifier button', saveContent);
  background.hide().on('click', hide);
};

var setDefaultSettings = function() {
  // Run, when the default settings are loaded
  var loadedDefaultSettings = function() {
    for (var id in localStorage) {
      // If the option must be enabled
      if (localStorage[id] == 1) enableOption(id);
    }
  };

  var enableOption = function(optionId) {
    $('#' + optionId, $('.options')).addClass('yes').find('input').attr('checked', 'checked');
  };

  // Checking: are the default settings loaded?
  var checkingDefaultSettings = function() {
    if (localStorage['clearvk_withAudio'] !== undefined) {
      clearInterval(timer);
      loadedDefaultSettings();
    }
  };
  var timer = setInterval(checkingDefaultSettings, 10);
};

// Change option (yes or now)
var changeOptionStatus = function() {
  var input = $(this);
  var option = input.closest('.option');

  // Change status of option
  var value = 0;
  if (input.is(':checked')) {
    value = 1;
    option.addClass('yes');
  } else { option.removeClass('yes'); }

  // Save settings
  localStorage.setItem(input.attr('name'), value);
};

// Localize title of page
$('title').html($('title').html() + localize('options'));

var localization = function() {
  $('#wrap')
    // Localize header
    .find('h1').html($('h1').html() + localize('options')).end()

    // Localize description
    .find('.description p').html(localize('options_description')).end()

    // Localize checkbox of option
    .find('.option label').each(function() {
      $(this).html(localize('options_yes') + $(this).html());
    }).end()

    // Localize content of option
    .find('.option').each(function() {
      var option = $(this);
      var nameOfOption = option.attr('id').replace('clearvk', '');
      $('.name', option).html(localize('options' + nameOfOption));
    }).end()

    // Localize content of notification
    .find('#notifier').html('<div class=\'notifier\'></div><button>' + localize('options_save') + '</button>');
};
