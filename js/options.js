var blocks = [
	'clearvk_class',
	'clearvk_repostFromGroups',
	'clearvk_linksToAsks'
];

$(function(){
	
	setTimeout(function(){
		setDefault();
	}, 100);
	
	$('.savebutton').on('click', saveParams);
	
	$('.options').load('optionsItems.html', function () {
		$('.option').checkbox();
	});
});

// Functions LocalStorage
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

// Functions LocalStorage
lS.get(blocks);

var setDefault = function () {
	for (var key in ls) {
		$('#'+key, $('.options')).find('input[type=checkbox]')
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
	}, 300);
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