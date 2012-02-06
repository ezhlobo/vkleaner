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
			
		var hrefMediaLink = unescape(post.find('.media_desc').find('.lnk').attr('href'));
		var hrefLinkInText = unescape(post.find('.wall_post_text').find('a').attr('href'));
		var templateHref = new RegExp("/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".+", "gi");
		if (templateHref.test(hrefMediaLink)) this.addCssClass(post);
		if (templateHref.test(hrefLinkInText)) {
			var htmlTemplateLinks = new RegExp("<a href=\"/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".[^>]+.[^<]+</a>", "gim");
			var postTextWithoutLinks = unescape(post.find('.wall_post_text').html()).replace(htmlTemplateLinks, '');
			if (postTextWithoutLinks.length < 60) this.addCssClass(post);
		} else {
			var postText = post.find('.wall_post_text').text();
			var templateLinkInTxt = new RegExp(sites, "gim");
			if (templateLinkInTxt.test(postText)){
				postText = postText.replace(templateHref, '').replace(/\n/gim, '');
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
		for (var name in whatNeedHide)
			hidePosts[ whatNeedHide[name] ] ( $(this) );
	});
}

var checkLocation = function () {
	if (window.location.pathname == '/feed') hideSomePosts();
}
setInterval(checkLocation, 500);
setTimeout(function () {
	whatNeedHide = [];
	if (localStorage['clearvk_repostFromGroups'] == 1) whatNeedHide.push('fromGroups');
	if (localStorage['clearvk_linksToAsks'] == 1) whatNeedHide.push('withLinks');
	if (localStorage['clearvk_video'] == 1) whatNeedHide.push('withVideo');
	if (localStorage['clearvk_audio'] == 1) whatNeedHide.push('withAudio');
	
	cssClassForHiddenPosts = (localStorage['clearvk_class'] == 1) ? 'clearvk-showTop' : 'clearvk-hideAll';
	hideSomePosts();
}, 100);