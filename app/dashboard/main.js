(function() {

var User      = namespace.module("user");

$(document).ready(function(){

	$.template( "tabTemplate", $('#tabTemplate'));
	$.template( "pagesTemplate", $('#pagesTemplate'));
	$.template( "logInToReadLaterTemplate", $('#logInToReadLaterTemplate'));
	$.template( "appsTemplate", $('#appsTemplate'));
	$.template( "bookmarksTemplate", $('#bookmarksTemplate'));

	$(window).resize(function() {
		tabz.position();
	});

	var tabz = {
		actions : {},
		user : (new User.Model).sync(),
		position : function(){
			var $container = $('#main');
			var innerWidth = Math.min( $container.innerWidth(), $container.width() );
			var units      = Math.floor( innerWidth / 300);
			var unitWidth  = Math.floor( innerWidth / units );
			$('.tab').width( unitWidth )

			$container.isotope({itemSelector: '.tab'});
		}
	};
	
	chrome.extension.sendRequest({
		type : 'getOpenTabs'
	},function(response) {
		$.each(response.tabs, function(i, item){
			//console.log('Tab:',item)
			$.tmpl( "tabTemplate", item ).data('tab',item).appendTo( "#main" );
			if( tabz.user.get('hasReadItLater') ){
				$('.buttons	.add').show();
			}

		});

		tabz.position();
	});

	window.tabz = tabz;

	window.port = chrome.extension.connect({name: "dashboard"});
	port.onMessage.addListener(function(msg) {
		console.log('msg:',msg);
	});
});

})();