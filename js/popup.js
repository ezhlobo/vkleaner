$(function(){
	
	setTimeout(function(){
		setDefault();
	}, 100);
	
});

var ls = {};
var lS = {
	set: function (name, value) {
		chrome.extension.sendRequest({
			type: 'set',
			name: name,
			value: value
		});
	},
	get: function (name) {
		chrome.extension.sendRequest({
			type: 'get',
			name: name
			},
			function(response) {
				ls[name] = response || 1;
			}
		);
	}
}
lS.get('clearvk_class');
lS.get('clearvk_repostFromGroups');
lS.get('clearvk_postsFromApps');

var setDefault = function () {
	var optionsBlock = $('.options');
	for (var key in ls) {
		$('#'+key, optionsBlock).find('input[type=checkbox]')
			.removeAttr('checked')
			.filter('[value='+ls[key]+']').attr('checked', 'checked');
	}
}