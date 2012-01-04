var blocks = [
	'clearvk_class',
	'clearvk_repostFromGroups',
	'clearvk_linksToAsks'
];

// Functions LocalStorage
var ls = {};
var lS = {
	fnGET: function (name) {
		chrome.extension.sendRequest({
			type: 'get',
			name: name
			},
			function(response) {
				ls[name] = response || 1;
			}
		);
	},
	get: function (elems) {
		for (var key in elems) lS.fnGET(elems[key]);
	}
}

// Your LocalStorage
lS.get(blocks);

var classToRows;
var fn = {
	id1: function (self) {
		var link = self.find('.published_by');
		if (link.length > 0) {
			var ourClass = self.children().attr('class');
			var symbolSingle = ourClass.substr(11, 1);
			var symbolGroup = ourClass.substr(17, 1);
			var symbolPhotos = link.siblings('.published_by_date').children('a').attr('href').substr(6, 1);
			
			if (symbolSingle == '-' || symbolGroup == '-' || symbolPhotos == '-') fn.addYourClass(self);
		}
	},
	id2: function (self) {
		var sites = "(ask.fm|sprashivai.ru|formspring.me|my-truth.ru|askbook.me|askme.by|qroom.ru|nekto.me)";
			sites = sites.replace(/\./gi, '\\.');
		
		var tpl = new RegExp("/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".+", "gi");
		var aLink = self.find('.media_desc .lnk');
		var bLink = self.find('.wall_post_text a');
		var href;
		if (aLink.length > 0) {
			href = decodeURIComponent(aLink.attr('href'));
			if (tpl.test(href)) fn.addYourClass(self);
		} else if (bLink.length > 0) {
			href = decodeURIComponent(bLink.attr('href'));
			if (tpl.test(href)) {
				var linkTpl = new RegExp("<a href=\"/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".[^>]+.[^<]+</a>", "gim");
				var postWithoutLinks = decodeURIComponent(bLink.parent().html()).replace(linkTpl, '');
				if (postWithoutLinks.length < 40) fn.addYourClass(self);
			}
		}
	},
	addYourClass: function (elem) {
		elem.find('.post').addClass(classToRows)
	}
}

// Add tags to posts
var fnAddTags = function () {
	$('#feed_rows').find('.feed_row').each(function(){
		var self = $(this);
		
		// Add tags to posts from groups
		if (ls['clearvk_repostFromGroups'] == 1) fn.id1(self);
		
		// Add tags to posts with links to asks
		if (ls['clearvk_linksToAsks'] == 1) fn.id2(self);
	});
};

var checkLocation = function () {
	var isFeed = /(vk|vkontakte)\.(com|ru)\/feed/gi.test(window.location);
	if (isFeed && isCheckLocation) {
		fnAddTags();
		isCheckLocation = false;
	} else if (!isFeed && !isCheckLocation) {
		isCheckLocation = true;
	}
}, isCheckLocation = true;

var checkRowcount = function () {
	if (currentRowcount != $('#feed_rows').find('.feed_row').length) {
		currentRowcount = $('#feed_rows').find('.feed_row').length;
		fnAddTags();
	}
}, currentRowcount = $('#feed_rows').find('.feed_row').length;

setInterval(checkRowcount, 1000);
setInterval(checkLocation, 500);

// Start!
setTimeout(function () {
	classToRows = (ls['clearvk_class'] == 1) ? 'clearvk-showTop' : 'clearvk-hideAll';
	fnAddTags();
}, 100);