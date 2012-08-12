$(function() {
  $('#wrap')
    .load('optionsItems.html', localization)
    .on('change', '.option input', changeOptionStatus);

  modal('#clearvk_withLinks a');

  setDefaultSettings();
});

// Make ownLocalStorage object
localStorageManager.getAllSettings();

var modal = function(element) {
  var animateDuration = 200;

  var background = $('body').append('<div class=\'background\'></div>').find('.background');
  background.display = function(value) {
    this.animate({opacity: value}, animateDuration);
  };

  localStorageManager.get('clearvk_withLinks_content');

  var open = function() {
    background.css({ width: $(document).width(), height: $(document).height() }).display('show');
    $('#notifier')
      .animate({opacity: 'show', top: '20px'}, animateDuration)
      .find('.notifier').html('<p class=\'title\'>' + getLocalizedText('options_toRestore') + '</p><textarea>' + links().join('\n') + '</textarea>');
    return false;
  };
  var hide = function() {
    background.display('hide');
    $('#notifier').animate({opacity: 'hide', top: '0'}, animateDuration);
    return false;
  };

  var saveContent = function() {
    var value = $('#notifier textarea').val().trim().replace(/\n/, linksSeparator);
    localStorageManager.set('clearvk_withLinks_content', value);
    localStorageManager.get('clearvk_withLinks_content');
    hide();
  };

  $('#wrap').on('click', element, open).on('click', '#notifier button', saveContent);
  background.hide().on('click', hide);
};

var setDefaultSettings = function() {
  // Run, when the default settings are loaded
  var loadedDefaultSettings = function() {
    $.each(ownLocalStorage, function(id) {
      // If the option must be enabled
      if (ownLocalStorage[id] == 1) enableOption(id);
    });
  };

  var enableOption = function(optionId) {
    $('#' + optionId, $('.options')).addClass('yes').find('input').attr('checked', 'checked');
  };

  // Checking: are the default settings loaded?
  var checkingDefaultSettings = function() {
    if (ownLocalStorage['clearvk_audio'] != void 0) {
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
  localStorageManager.set(input.attr('name'), value);
};

// Localize title of page
$('title').html($('title').html() + getLocalizedText('options'));

var localization = function() {
  $('#wrap')
    // Localize header
    .find('h1').html($('h1').html() + getLocalizedText('options')).end()

    // Localize description
    .find('.description p').html(getLocalizedText('options_description')).end()
      
    // Localize checkbox of option
    .find('.option label').each(function() {
      $(this).html(getLocalizedText('options_yes') + $(this).html());
    }).end()

    // Localize content of option
    .find('.option').each(function() {
      var option = $(this);
      var nameOfOption = option.attr('id').replace('clearvk', '');
      $('.name', option).html(getLocalizedText('options' + nameOfOption));
    }).end()

    // Localize content of notification
    .find('#notifier').html('<div class=\'notifier\'></div><button>' + getLocalizedText('options_save') + '</button>');
};
