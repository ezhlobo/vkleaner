var blocks = 'clearvk_class, clearvk_repostFromGroups, clearvk_linksToAsks';

$(function(){
	lS.get(blocks);
	setTimeout(setDefault, 300);
	
	$('.options').load('optionsItems.html', onLoadOptions);
	
	$('.savebutton').on('click', saveParams);
});

// Own LocalStorage
var lS = {
	set: function (name, value) {
		chrome.extension.sendRequest({type:'set', name:name, value:value});
	},
	fnGET: function (name, defaultValue) {
		chrome.extension.sendRequest({type:'get', name:name}, function (response) {
			ls[name] = response || defaultValue;
		});
	},
	get: function (elems) {
		elems = elems.split(', ');
		for (var key in elems) this.fnGET(elems[key], 1);
	}
}, ls = {};

var onLoadOptions = function () {
	$('#clearvk_linksToAsks a').on('click', function () {
		lS.get('clearvk.sites');
		setTimeout(function(){
			notifier.show('sites');
		}, 10);
		return false;
	});
}

var setDefault = function () {
	for (var key in ls) $('#'+key).find('input').removeAttr('checked').filter('[value='+ls[key]+']').attr('checked', 'checked');
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
			.animation('show', '+', notifier.content(id))
			.save(id);
		},
	hide: function () {
		notifier
			.background.hide()
			.animation('hide', '-', '')
			.save();
		},
	save: function (id) {
		var save = function () {
			var $this = $(this);
				$this.html('Сохранение...');
			lS.set('clearvk.sites', notifier.content(id, 'save'));
			setTimeout(function(){
				$this.html('Сохранить');
				notifier.hide();
			}, 300);
		}
		
		if (id) $('#notifier button').on('click', save); else $('#notifier button').off('click');
	},
	animation: function (vOpacity, vTop, html) {
		$('#notifier').animate({opacity: vOpacity, marginTop: vTop+'=20px'}, 100).children('.notifier').html(html);
		return this;
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
	content: function (id, way) {
		switch (id) {
			case 'sites':
				if (way == 'save') {
					return $('#notifier textarea').val().trim().split('\n');
				} else {
					var sites = ls['clearvk.sites'];
						sites = (sites == 1) ?['ask.fm', 'sprashivai.ru', 'formspring.me', 'my-truth.ru', 'askbook.me', 'askme.by', 'qroom.ru', 'nekto.me'] : sites.split(',');
					return '<p class="title">Для восстановления введите 1 и сохраните</p><textarea class="clearvk-id2">'+sites.join('\n')+'</textarea>';
				}
				break;
		}
	}
}