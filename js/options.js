$(function(){
  localStorageManager.get(idsBlocksWithOptions + ", clearvk.sites");
  setTimeout(setDefaultOptions, 300);

  $("#wrap")
    .load("optionsItems.html")
    .on("click", "#clearvk_linksToAsks a", function () {
      notification.show("sites");
      return false;
    })
    .on("click", ".savebutton", saveParams);
});

var defaultSites = ["ask.fm", "sprashivai.ru", "formspring.me", "my-truth.ru", "askbook.me", "askme.by", "qroom.ru", "nekto.me"]
var idsBlocksWithOptions = "clearvk_class, clearvk_repostFromGroups, clearvk_linksToAsks, clearvk_video, clearvk_audio";
var localStorageManager = {
  set: function (name, value) {
    chrome.extension.sendRequest({type:"set", name:name, value:value});
  },
  fnGET: function (name) {
    chrome.extension.sendRequest({type:"get", name:name}, function (response) {
      ownLocalStorage[name] = response || 1;
    });
  },
  get: function (ids) {
    collectionIds = ids.split(", ");
    for (var k in collectionIds) localStorageManager.fnGET(collectionIds[k]);
  }
}, ownLocalStorage = {};

var getBadUrls = function () {
  var urls = ownLocalStorage["clearvk.sites"];
  return (urls == 1) ? defaultSites : urls.split(",");
}

var setDefaultOptions = function () {
  for (var id in ownLocalStorage) $("#"+id).find("input").removeAttr("checked").filter("[value="+ownLocalStorage[id]+"]").attr("checked", "checked");
}
var saveParams = function () {
  var self = $(this);
  $(".option").each(function(){
    localStorageManager.set($(this).attr("id"), $(this).find("input:checked").val());
  });
  showStatusMessage();
}

var showStatusMessage = function () {
  notification.hide();
  $("#status").show();
  setTimeout(function(){ $("#status").hide(); }, 600);
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
      localStorageManager.set("clearvk.sites", notification.content(id, "save"));
      setTimeout(showStatusMessage, 300);
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
          return "<p class=\"title\">Для восстановления введите 1 и сохраните</p><textarea class=\"clearvk-id2\">"+getBadUrls().join("\n")+"</textarea>";
        }
        break;
    }
  }
}