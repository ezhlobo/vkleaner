var idsBlocksWithOptions = 'clearvk_class, clearvk_repostFromGroups, clearvk_linksToAsks, clearvk_video, clearvk_audio';
var localStorageManager = {
	fnGET: function (name) {
		chrome.extension.sendRequest({type:'get', name:name}, function (response) {
			localStorage[name] = response || 1;
		});
	},
	get: function (ids) {
		collectionIds = ids.split(', ');
		for (var k in collectionIds) localStorageManager.fnGET(collectionIds[k]);
	}
}, localStorage = {};
localStorageManager.get(idsBlocksWithOptions + ', clearvk.sites');

var cssClassForHiddenPosts;
var hidePosts = {
	fromGroups: function (post) {
		var repost = post.find('.published_by');
		if (repost.length > 0) {
			var currentRow = post.closest('.feed_row');
			var cssClass = currentRow.children().attr('class');
			var isRepostGroup = cssClass.substr(17, 1) == '-';
			var isRepostSingle = cssClass.substr(11, 1) == '-';
			var isRepostPhotos = repost.siblings('.published_by_date').children('a').attr('href').substr(6, 1) == '-';
			if (isRepostGroup || isRepostSingle || isRepostPhotos) this.addCssClass(post);
			if (isRepostGroup) currentRow.find('.feed_reposts_more').addClass(cssClassForHiddenPosts+'-group');
		}
	},
	withLinks: function (post) {
		var sites = localStorage['clearvk.sites'];
		sites = (sites == 1) ? ['ask.fm', 'sprashivai.ru', 'formspring.me', 'my-truth.ru', 'askbook.me', 'askme.by', 'qroom.ru', 'nekto.me'].join('|') : sites.split(',').join('|');
		sites = "("+sites.replace(/\./gi, '\\.')+")";
			
		var templatesUrls = new RegExp("/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".+", "gi");
		var mediaLink = post.find('.media_desc').find('.lnk');
		var linkInText = post.find('.wall_post_text').find('a');
		if (mediaLink.length > 0) {
			var href = unescape(mediaLink.attr('href'));
			if (templatesUrls.test(href)) this.addCssClass(post);
		} else if (linkInText.length > 0) {
			var href = unescape(linkInText.attr('href'));
			if (templatesUrls.test(href)) {
				var htmlTemplatesUrls = new RegExp("<a href=\"/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".[^>]+.[^<]+</a>", "gim");
				var postTextWithoutLinks = unescape(linkInText.parent().html()).replace(htmlTemplatesUrls, '');
				if (postTextWithoutLinks.length < 60) this.addCssClass(post);
			}
		} else {
			var postText = post.find('.wall_post_text').text();
			var linkInTxt = new RegExp(sites+"\\/\\S", "gim");
			if (linkInTxt.test(postText)){
				postText = postText.replace(templatesUrls, '').replace(/\n/gim, '');
				if (postText.length < 60) this.addCssClass(post);
			}
		}
	},
	withVideo: function (post) {
		var video = post.find('.page_media_video');
		if (video.length > 0) this.addCssClass(post);
	},
	withAudio: function (post) {
		var audio = post.find('.audio');
		if (audio.length > 0) this.addCssClass(post);
	},
	addCssClass: function (post) { post.addClass(cssClassForHiddenPosts) }
}
var hideSomePosts = function () {
	$('#feed_rows').find('.post:not(.'+cssClassForHiddenPosts+')').each(function(){
		var $this = $(this);
		
		if (localStorage['clearvk_repostFromGroups'] == 1)
			hidePosts.fromGroups($this);
		
		if (localStorage['clearvk_linksToAsks'] == 1)
			hidePosts.withLinks($this);
		
		if (localStorage['clearvk_video'] == 1)
			hidePosts.withVideo($this);
		
		if (localStorage['clearvk_audio'] == 1)
			hidePosts.withAudio($this);
	});
}

var checkLocation = function () {
	if (window.location.pathname == '/feed') hideSomePosts();
}
setInterval(checkLocation, 500);
setTimeout(function () {
	cssClassForHiddenPosts = (localStorage['clearvk_class'] == 1) ? 'clearvk-showTop' : 'clearvk-hideAll';
	hideSomePosts();
}, 100);