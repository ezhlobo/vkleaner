// Localize
$("title").html($("title").html()+ getMessage("options"));
var localize = function () {
  $("#wrap")
    .find("h1").html($("h1").html()+" "+ getMessage("options")).end()
    .find(".description p").html(getMessage("options_description")).end()
    .find(".option").each(function () {
      $(this).find("label").each(function (n) {
        $(this).html(getMessage("options_yes") + $(this).html());
      });
    }).end()
    .find("#clearvk_repostFromGroups .name").html(getMessage("options_repostFromGroups")).end()
    .find("#clearvk_linksToAsks .name").html(getMessage("options_withLinks")).end()
    .find("#clearvk_video .name").html(getMessage("options_video")).end()
    .find("#clearvk_audio .name").html(getMessage("options_audio")).end()
    .find("#clearvk_class .name").html(getMessage("options_class")).end()
    .find("#notifier").html("<div class=\"notifier\"></div><button>"+ getMessage("options_save") +"</button>").end();
};

$(function(){
  localStorageManager.get(idsBlocksWithOptions + ", clearvk.sites");
  setDefaultOptions();

  $("#wrap")
    .load("optionsItems.html", localize)
    .on("click", "#clearvk_linksToAsks a", function () {
      notification.show("sites");
      return false;
    })
    .on("change", ".option input", saveParam);
});

var defaultSites = ["ask.fm", "sprashivai.ru", "formspring.me", "my-truth.ru", "askbook.me", "askme.by", "qroom.ru", "nekto.me"]
var idsBlocksWithOptions = "clearvk_class, clearvk_repostFromGroups, clearvk_linksToAsks, clearvk_video, clearvk_audio";
var localStorageManager = {
  set: function (name, value) {
    chrome.extension.sendRequest({type:"set", name:name, value:value});
    return this;
  },
  fnGET: function (name) {
    chrome.extension.sendRequest({type:"get", name:name}, function (response) {
      ownLocalStorage[name] = response || 1;
    });
  },
  get: function (ids) {
    collectionIds = ids.split(", ");
    for (var k in collectionIds) this.fnGET(collectionIds[k]);
  }
}, ownLocalStorage = {};

var getBadUrls = function () {
  var urls = ownLocalStorage["clearvk.sites"];
  return (urls == 1) ? defaultSites : urls.split(",");
}

var setDefaultOptions = function () {
  var loadedDefaultParams = function () {
    clearInterval(timer);
    var option = $(".options").find(".option").removeClass("yes").find("input").removeAttr("checked").end();
    for (var id in ownLocalStorage) {
      if (ownLocalStorage[id] == 1)
        option.filter("#"+id).addClass("yes").find("input").attr("checked", "checked");
    }
  };
  var gettingDefaultParams = function () {
    if(ownLocalStorage["clearvk.sites"] != void 0)
      loadedDefaultParams();
  };
  var timer = setInterval(gettingDefaultParams, 10);
}

var saveParam = function () {
  var self = $(this);
  var thisRowBlock = self.closest(".option");
  var value = 0;
  if (self.is(":checked")) {
    value = 1;
    thisRowBlock.addClass("yes");
  } else {
    thisRowBlock.removeClass("yes");
  }
  localStorageManager.set(self.attr("name"), value);
}

var notification = {
  show: function (id) {
    notification
      .background.show()
      .animation("show", "+", notification.content(id))
      .addTriggerSave(id);
  },
  hide: function () {
    notification
      .background.hide()
      .animation("hide", "-", "")
      .removeTriggerSave();
  },
  addTriggerSave: function (id) {
    $("#notifier button").on("click", function () {
      localStorageManager
        .set("clearvk.sites", notification.content(id, "save"))
        .get("clearvk.sites");
      notification.hide();
    });
  },
  removeTriggerSave: function () { $("#notifier button").off("click"); },
  animation: function (valueOpacity, symbolTop, html) {
    $("#notifier").animate({opacity: valueOpacity, marginTop: symbolTop+"=20px"}, 100).children(".notifier").html(html);
    return this;
  },
  background: {
    show: function () {
      $("body").append("<div class=\"background\"></div>");
      $(".background").width($(document).width()).height($(document).height()).on("click", function(){
        $(this).off("click");
        notification.hide();
      });
      return notification;
    },
    hide: function () {
      $(".background").off("click").remove();
      return notification;
    }
  },
  content: function (id, way) {
    switch (id) {
      case "sites":
        if (way == "save") {
          return $("#notifier textarea").val().trim().split("\n");
        } else {
          return "<p class=\"title\">"+ getMessage("options_toRestore") +"</p><textarea class=\"clearvk-id2\">"+getBadUrls().join("\n")+"</textarea>";
        }
        break;
    }
  }
}
function getMessage (query) {
  return chrome.i18n.getMessage(query);
}