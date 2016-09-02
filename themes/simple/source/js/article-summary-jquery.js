$(document).ready(function () {
	'use strict'

	var actions = [],
		pages = [],
		actionGetPagesData = false,
		actoinPageView = false,
		pageViewTarget = '',
		pageViewKey = '';

	$('span.blog-tools-api[get-pages-data]').each(function(index, element){
		var page = $(this).data('page');
		if (page) {
			pages.push(page);

			if (!actionGetPagesData) {
				actionGetPagesData = true;
				actions.push('getPagesData');
			}
		}
	});

	pageViewTarget = $('span.blog-tools-api[page-view]');
	if (pageViewTarget.length) {
		actoinPageView = true;
		pageViewKey = pageViewTarget.data('page');
		actions.push('pageView');
	}

	$.post('/api.php', {
		action: actions,
		host: location.hostname,
		pages: pages,
		pageViewKey: pageViewKey,
	}, function(data){
		var j, pageUri, selector;
		if (data.getPagesData) {
			for (j = 0; j < data.getPagesData.length; j++) {
				pageUri = data.getPagesData[j].uri;
				selector = 'span.blog-tools-api[get-pages-data][data-page="' + pageUri + '"]';
				$(selector).text(data.getPagesData[j].view);
			}
		}
	});
});
