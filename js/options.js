var blocks = [
	'clearvk_class',
	'clearvk_repostFromGroups',
	'clearvk_linksToAsks'
];

$(function(){
	
	setTimeout(setDefault, 100);
	
	$('.savebutton').on('click', saveParams);
	
	$('.options').load('optionsItems.html', function () {
		$('#clearvk_linksToAsks a').on('click', function () {
			lS.get(['clearvk.sites']);
			setTimeout(function(){
				notifier.show('sites')
			}, 100);
			return false;
		});
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

lS.get(blocks);
var setDefault = function () {
	for (var key in ls) {
		$('#'+key, $('.options')).find('input').removeAttr('checked').filter('[value='+ls[key]+']').attr('checked', 'checked');
	}
}

var saveParams = function () {
	var self = $(this);
		self.html('Сохранение...');
		
	$('.option').each(function(){
		lS.set($(this).attr('id'), $(this).find('input:checked').val());
	});
	
	setTimeout(function(){
		self.html('Сохранить');
	}, 300);
}

var notifier = {
	show: function (id) {
		notifier
			.background.show()
			.animation('show', '80px', notifier.content(id))
			.save(true, id);
	},
	hide: function () {
		notifier
			.background.hide()
			.animation('hide', '60px', '')
			.save(false);
	},
	save: function (on, id) {
		var save = function () {
			var $this = $(this);
			$this.html('Сохранение...');
			lS.set('clearvk.sites', notifier.getContent(id));
			setTimeout(function(){
				$this.html('Сохранить');
				notifier.hide();
			}, 300);
		}
		
		if (on) $('#notifier button').on('click', save);
			else $('#notifier button').on('click', save);
	},
	animation: function (vOpacity, vTop, html) {
		$('#notifier').animate({opacity: vOpacity, marginTop: vTop}, 100).children('.notifier').html(html);
		return notifier;
	},
	background: {
		show: function () {
			$('body').append('<div class="background"></div>');
			$('.background').width($(document).width()).height($(document).height()).on('click', function(){
				$(this).off('click');
				notifier.hide();
			});
			return notifier;
		},
		hide: function () {
			$('.background').remove();
			return notifier;
		}
	},
	content: function (id) {
		switch (id) {
			case 'sites':
				var sites = ls['clearvk.sites'];
					sites = (sites == 1) ? ['ask.fm', 'sprashivai.ru', 'formspring.me', 'my-truth.ru', 'askbook.me', 'askme.by', 'qroom.ru', 'nekto.me'] : sites.split(',');
				return '<p class="title">Для восстановления введите 1 и сохраните</p><textarea class="clearvk-id2">'+sites.join('\n')+'</textarea>';
				break;
		}
	},
	getContent: function (id) {
		switch (id) {
			case 'sites':
				return $('#notifier textarea').val().trim().split('\n');
				break;
		}
	}
}