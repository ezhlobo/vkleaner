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
		for (var key in elems) {
			lS.fnGET(elems[key]);
		}
	}
}
	
var blocks = [
	'clearvk_class',
	'clearvk_repostFromGroups',
	'clearvk_linksToAsks'
];
function initExtension () {
	lS.get(blocks);
	
	// Mark a rows
	var markSomeRows = function () {

		$('#feed_rows').find('.feed_row').each(function(){
			var self = $(this);
			
			// Mark REPOST FROM GROUPS
			if (ls['clearvk_repostFromGroups'] == 1) {
				var link = self.find('.published_by');
				if (link.length > 0) {
					var lClass = self.children().attr('class');
					var symbol = lClass.substr(11, 1);
					var symbolGroup = lClass.substr(17, 1);
					var symbolPhotos = link.siblings('.published_by_date').children('a').attr('href').substr(6, 1);
					if (symbol == '-' || symbolGroup == '-' || symbolPhotos == '-') {
						addClass(self);
					}
				}
			}
			
			// Mark posts with LINKS TO ASKS
			if (ls['clearvk_linksToAsks'] == 1) {
				var sites = "(ask.fm|sprashivai.ru|formspring.me|my-truth.ru|askbook.me|askme.by|qroom.ru|nekto.me)";
					sites = sites.replace(/\./gi, '\\.');
				
				var tpl = new RegExp("/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".+", "gi");
				var aLink = self.find('.media_desc .lnk');
				var bLink = self.find('.wall_post_text').find('a');
				if (aLink.length > 0) {
					var href = decodeURIComponent(aLink.attr('href'));
					if (tpl.test(href)) addClass(self);
				} else if (bLink.length > 0) {
					var href = decodeURIComponent(bLink.attr('href'));
					if (tpl.test(href)) {
						var linkTpl = new RegExp("<a href=\"/away.php\\?to=http:\\/\\/(w{3}\\.)?"+ sites +".[^>]+.[^<]+</a>", "gim");
						var str = decodeURIComponent(bLink.parent().html()).replace(linkTpl, '');
						if (str.length < 40) addClass(self);
					}
				}
			}
			
			
		});
	}
	var addClass = function (elem) {
		var newClass = (ls['clearvk_class'] == 1) ? 'showTop' : 'hideAll';
		elem.find('.post').addClass('clearvk-'+newClass)
	}

	// Checks
	var rows = $('#feed_rows');
	var checkLocation = function () {
		if (/(vk|vkontakte)\.(com|ru)\/feed/gi.test(window.location)) markSomeRows();
	}
	var st = {count: rows.find('.feed_row').length}
	var checkRowsCount = function () {
		if (st.count != rows.find('.feed_row').length) {
			st.count = rows.find('.feed_row').length;
			markSomeRows();
		}
	}
	
	// Triggers:
	setInterval(checkRowsCount, 1000);
	setInterval(checkLocation, 500);
	setTimeout(markSomeRows, 100);
}
initExtension();