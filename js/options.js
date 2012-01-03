var blocks = [
	'clearvk_class',
	'clearvk_repostFromGroups',
	'clearvk_linksToAsks'
];

$(function(){
	var blocksToUI = [];
	for (var key in blocks) {
		blocksToUI.push('#'+blocks[key]);
	}
	$(blocksToUI.join(', ')).checkbox();
	
	setTimeout(function(){
		setDefault();
	}, 100);
	
	$('.savebutton').on('click', saveParams);
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
lS.get(blocks);

var setDefault = function () {
	var optionsBlock = $('.options');
	for (var key in ls) {
		$('#'+key, optionsBlock).find('input[type=checkbox]')
			.removeAttr('checked')
			.filter('[value='+ls[key]+']').attr('checked', 'checked');
	}
}

var saveParams = function () {
	var self = $(this);
	self.html('Сохранение...');
	$('.option').each(function(){
		lS.set($(this).attr('id'), $(this).find('input[type=checkbox]:checked').val());
	});
	setTimeout(function(){
		self.html('Сохранить');
	}, 200);
}

$.fn.checkbox = function () {
	return this.each(function(){
		
		var self = $(this);
		var inputs = self.find('.params').find('input[type=checkbox]');
		inputs.on('change', function () {
			if ($(this).is(':checked')) {
				inputs.removeAttr('checked').eq($(this).parent().index()).attr('checked', 'checked');
			} else {
				inputs.attr('checked', 'checked');
				$(this).removeAttr('checked');
			}
		});
		
	});
}