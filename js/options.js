var optionsBlock, wrapBlock;

hata.ready(function() {
  wrapBlock = hata("#wrap");
  optionsBlock = hata(".options");

  localization();
  Storage.selectAll( setDefaultSettings );

  wrapBlock.find(".option input").bind("change", changeOptionStatus );

  modalBlacklist("#clearvk_withLinks a");
});

var modalBlacklist = function( element ) {
  var notifier = hata("#notifier");
  var background = hata("body").append("<div class=\"background\"></div>").find(".background");

  var open = function( e ) {
    e.preventDefault();

    var cssObj = {
      display: "block",
      opacity: 0
    };

    background.css( hata.extend({}, cssObj, {
      width: document.width,
      height: document.height
    }));

    notifier.css( cssObj );

    hata.animate({
      step: function( x ) {
        x = Math.pow( x, 1/2);
        var y = 20 * x;

        var cssObj = {
          opacity: x
        };

        background.css( cssObj );
        notifier.css( hata.extend( cssObj, {
          top: y
        }));
      }
    });

    Storage.select("clearvk_withLinks_content", function() {
      notifier.find(".notifier textarea").val(links().join("\n"));
    });
  };

  var hide = function() {
    hata.animate({
      step: function( x ) {
        x = Math.pow( x, 1/2);
        var y = 20 - 20 * x;

        var cssObj = {
          opacity: 1 - x
        };

        background.css( cssObj );
        notifier.css( hata.extend( cssObj, {
          top: y
        }));
      },
      done: function() {
        var cssObj = {
          display: "none"
        };

        background.css( cssObj );
        notifier.css( cssObj );
      }
    });
  };

  var saveContentAndHide = function() {
    var arrayOfContent = notifier.find("textarea").val().trim().split("\n");

    var value = cleanArray( arrayOfContent ).length > 0
      ? cleanArray( arrayOfContent ).join(";")
      : "clearvk_withLinks_content";

    Storage.set("clearvk_withLinks_content", value );

    hide();
  };

  wrapBlock.find(element).bind("click", open );
  wrapBlock.find("#notifier button").bind("click", saveContentAndHide );

  background.bind("click", hide );
};

var enableOption = function( optionId, firstInit ) {
  var option = optionsBlock.find("#" + optionId );

  option.addClass("yes");

  if ( firstInit ) {
    option.find("input").attr("checked", "checked");
  } else {
    Storage.set( optionId, 1);
  }
};

var disableOption = function( optionId ) {
  optionsBlock.find("#" + optionId).removeClass("yes");

  Storage.set( optionId, 0);
};

var changeOptionStatus = function() {
  var input = hata(this);
  var optionId = input.attr("name");

  if ( input.is(":checked") ) {
    enableOption( optionId );
  } else {
    disableOption( optionId );
  }
};

var setDefaultSettings = function() {
  hata.each( Storage.items, function( value, optionId ) {
    if ( parseInt(value) === 1 ) {
      enableOption( optionId, true);
    }
  });
};

var localization = function() {
  var notifierContent = "<div class=\"notifier\"><p class=\"title\">" + localize("options_toRestore") + "</p><textarea></textarea></div><button>" + localize("options_save") + "</button>";

  // Localize title of page
  hata("title").html(hata("title").html() + localize_options);

  // Localize header
  wrapBlock.find("h1").html(hata("h1").html() + localize_options);

  // Localize description
  wrapBlock.find(".description p").html(localize("options_description"));

  // Localize checkbox of option
  wrapBlock.find(".option .params").each(function() {
    this.innerHTML = localize_yes + this.innerHTML;
  });

  // Localize content of option
  wrapBlock.find(".option").each(function() {
    var option = hata(this);
    var nameOfOption = option.attr("id").replace("clearvk", "");
    option.find(".name").html(localize("options" + nameOfOption));
  });

  // Localize content of notification
  wrapBlock.find(notifier).html(notifierContent);
};
