var defaultSites = ["ask.fm", "sprashivai.ru", "formspring.me", "my-truth.ru", "askbook.me", "askme.by", "qroom.ru", "nekto.me", "trislovamne.ru"];
var idsBlocksWithOptions = "clearvk_class, clearvk_repostFromGroups, clearvk_linksToAsks, clearvk_video, clearvk_audio";
var localStorageManager = {
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
localStorageManager.get(idsBlocksWithOptions + ", clearvk.sites");

var getBadUrls = function () {
  var urls = ownLocalStorage["clearvk.sites"];
  return (urls == 1) ? defaultSites : urls.split(",");
}

var cssClassForHiddenPosts, whatNeedHide;
var hidePosts = {
  fromGroups: function (post) {
    var repost = post.find(".published_by");
    if (repost.length > 0) {
      var currentRow = post.closest(".feed_row");
      var cssClass = currentRow.children().attr("class");
      var isRepostGroup = cssClass.substr(17, 1) == "-";
      var isRepostSingle = cssClass.substr(11, 1) == "-";
      var isRepostPhotos = repost.siblings(".published_by_date").children("a").attr("href").substr(6, 1) == "-";

      if (isRepostGroup || isRepostSingle || isRepostPhotos)
        this.addCssClass(post);
      if (isRepostGroup)
        currentRow.find(".feed_reposts_more").addClass(cssClassForHiddenPosts+"-group");
    }
  },
  withLinks: function (post) {
    var hrefMediaLink = unescape(post.find(".media_desc").find(".lnk").attr("href"));
    var hrefLinkInText = unescape(post.find(".wall_post_text").find("a").attr("href"));
    var postText = post.find(".wall_post_text").text();

    var templateHref = new RegExp("(http:\\/\\/|w{3}\\.|\s)("+ getBadUrls().join("|").replace(/\./gi, "\\.") +")", "gi");
    if (templateHref.test(hrefMediaLink) || templateHref.test(hrefLinkInText) || templateHref.test(postText))
      this.addCssClass(post);
  },
  withVideo: function (post) {
    var video = post.find(".page_media_video");
    if (video.length > 0)
      this.addCssClass(post);
  },
  withAudio: function (post) {
    var audio = post.find(".audio");
    if (audio.length > 0)
      this.addCssClass(post);
  },
  addCssClass: function (post) { post.addClass(cssClassForHiddenPosts) }
}
var hideSomePosts = function () {
  // Get new values of settings
  localStorageManager.get(idsBlocksWithOptions + ", clearvk.sites");

  // Get new params for unwanted posts
  newParams();

  $("#feed_rows").find(".post").each(function(){
    // Remove all hidden class
    $(this).removeClass("clearvk-showTop clearvk-hideAll");

    for (var name in whatNeedHide)
      hidePosts[ whatNeedHide[name] ] ( $(this) );
  });
}

var checkLocation = function () {
  if (window.location.pathname == "/feed")
    hideSomePosts();
}

var running;
var runExtension = function () {
  clearInterval(running);
  setInterval(checkLocation, 500);
  hideSomePosts();
};
var newParams = function () {
  // New array
  whatNeedHide = [];
  if (ownLocalStorage["clearvk_repostFromGroups"] == 1)
    whatNeedHide.push("fromGroups");
  if (ownLocalStorage["clearvk_linksToAsks"] == 1)
    whatNeedHide.push("withLinks");
  if (ownLocalStorage["clearvk_video"] == 1)
    whatNeedHide.push("withVideo");
  if (ownLocalStorage["clearvk_audio"] == 1)
    whatNeedHide.push("withAudio");

  // New class for all posts
  cssClassForHiddenPosts = (ownLocalStorage["clearvk_class"] == 1) ? "clearvk-showTop" : "clearvk-hideAll";
}
var initExtension = function () {
  newParams();

  if (whatNeedHide.length != 0)
    runExtension();
};

running = setInterval(initExtension, 10);