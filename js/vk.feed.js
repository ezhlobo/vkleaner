var blocks = 'clearvk_class, clearvk_repostFromGroups, clearvk_linksToAsks, clearvk_video, clearvk_audio';

// Functions LocalStorage
var lS = {
	fnGET: function (name) {
		chrome.extension.sendRequest({type:'get', name:name}, function (response) {
			ls[name] = response || 1;
		});
	},
	get: function (elems) {
		elems = elems.split(', ');
		for (var key in elems) lS.fnGET(elems[key]);
	}
}, ls = {};

// Your LocalStorage
lS.get(blocks +', '+ 'clearvk.sites');

var classToRows;
var fn = {
	// Hide posts from groups
	id1: function (self) {
		var link = self.find('.published_by');
		if (link.length > 0) {
			var ourClass = self.parent().attr('class');
			var symbolSingle = ourClass.substr(11, 1);
			var symbolGroup = ourClass.substr(17, 1);
			var symbolPhotos = link.siblings('.published_by_date').children('a').attr('href').substr(6, 1);
			
			if (symbolSingle == '-' || symbolGroup == '-' || symbolPhotos == '-') this.addYourClass(self);
		}
	},
	// Hide posts with links to asks
	id2: function (self) {
		var sites = ls['clearvk.sites'];
			sites = (sites == 1) ? ['ask.fm', 'sprashivai.ru', 'formspring.me', 'my-truth.ru', 'askbook.me', 'askme.by', 'qroom.ru', 'nekto.me'].join('|') : sites.split(',').join('|');
			sites = "("+sites.replace(/\./gi, '\\.')+")";
			
		var tpl = new RegExp("/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".+", "gi");
		var aLink = self.find('.media_desc .lnk');
		var bLink = self.find('.wall_post_text a');
		var href;
		if (aLink.length > 0) {
			href = decodeURIComponent(aLink.attr('href'));
			if (tpl.test(href)) this.addYourClass(self);
		} else if (bLink.length > 0) {
			href = decodeURIComponent(bLink.attr('href'));
			if (tpl.test(href)) {
				var linkTpl = new RegExp("<a href=\"/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".[^>]+.[^<]+</a>", "gim");
				var postWithoutLinks = decodeURIComponent(bLink.parent().html()).replace(linkTpl, '');
				if (postWithoutLinks.length < 60) this.addYourClass(self);
			}
		} else {
			var txt = self.find('.wall_post_text').text();
			var linkInTxt = new RegExp(sites+"\\/\\S", "gim");
			if (linkInTxt.test(txt)){
				txt = txt.replace(tpl, '').replace(/\n/gim, '');
				if (txt.length < 60) this.addYourClass(self);
			}
		}
	},
	// Hide posts with video
	id3: function (self) {
		var video = self.find('.page_media_video');
		if (video.length > 0) this.addYourClass(self);
	},
	// Hide posts with audio
	id4: function (self) {
		var audio = self.find('.audio');
		if (audio.length > 0) this.addYourClass(self);
	},
	addYourClass: function (elem) { elem.addClass(classToRows) }
}

// Add tags to posts
var fnAddTags = function () {
	$('#feed_rows').find('.post:not(.'+classToRows+')').each(function(){
		var $this = $(this);
		
		// Add tags to posts from groups
		if (ls['clearvk_repostFromGroups'] == 1) fn.id1($this);
		
		// Add tags to posts with links to asks
		if (ls['clearvk_linksToAsks'] == 1) fn.id2($this);
		
		// Add tags to posts with video
		if (ls['clearvk_video'] == 1) fn.id3($this);
		
		// Add tags to posts with audio
		if (ls['clearvk_audio'] == 1) fn.id4($this);
	});
};

var checkLocation = function () {
	if (/(vk|vkontakte)\.(com|ru)\/feed/gi.test(window.location)) fnAddTags();
}
setInterval(checkLocation, 500);

// Start!
setTimeout(function () {
	classToRows = (ls['clearvk_class'] == 1) ? 'clearvk-showTop' : 'clearvk-hideAll';
	fnAddTags();
}, 100);