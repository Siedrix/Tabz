(function() {

var User      = namespace.module("user");

$(document).ready(function(){

	$.template( "tabTemplate", $('#tabTemplate'));
	$.template( "pagesTemplate", $('#pagesTemplate'));
	$.template( "logInToReadLaterTemplate", $('#logInToReadLaterTemplate'));
	$.template( "appsTemplate", $('#appsTemplate'));
	$.template( "bookmarksTemplate", $('#bookmarksTemplate'));

	$(window).resize(function() {
		$('nav').jScrollPane();
	});

	var tabz = {
		actions : {},
		user : (new User.Model).sync()
	};

	tabz.actions.requestReadItLater = function(){
		if( tabz.user.get('hasReadItLater') ){
			console.log('Render read it later list');
			chrome.extension.sendRequest({
				type : 'getReadItLater'
			},function(response){
				$('#pages').html('').attr('class','');
				$('nav').attr('class','');
				$.each(response.pages, function(i, item){
					$.tmpl( "pagesTemplate", item ).data('page',item).appendTo( "#pages" );		
					$('nav').jScrollPane().addClass('readItLater');
				});
			});
		}else{
			$('#pages').html('').attr('class','');
			$('nav').attr('class','');				
			$.tmpl( "logInToReadLaterTemplate", {} ).appendTo( "#pages" );			
		}
	}

	tabz.actions.requestChromeBookmarks = function(){
		chrome.extension.sendRequest({
			type : 'getChromeBookmarks'
		},function(response){
			$('#pages').html('');
			$('nav').attr('class','');			
			$.each(response.bookmarks, function(i, item){
				$.tmpl( "bookmarksTemplate", item ).data('app',item).appendTo( "#pages" );
				$('nav').jScrollPane().addClass('chromeBookmarks');
			});									
		});
	}

	tabz.actions.requestChromeApps = function(){	
		chrome.extension.sendRequest({
			type : 'getChromeApps'
		},function(response){
			//console.log(response);
			$('#pages').html('');
			$('nav').attr('class','');
			$.each(response.apps, function(i, item){			
				$.tmpl( "appsTemplate", item ).data('app',item).appendTo( "#pages" );		
				$('nav').jScrollPane().addClass('chromeApps');
			});						
		});
	}	

	
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

		var $container = $('#main');
		$container.isotope({        
			itemSelector: '.tab'      
		});
				
		setTimeout(function () {
			$container.isotope({        
				itemSelector: '.tab'      
			});
		}, 500)
	});

	window.tabz = tabz;

	var background = localStorage.getItem('background');
	if(background){
		backgroundImage = $('<style/>')
		 .text('body{background-image:url('+background+')}')
		 .appendTo('head');
	}
	delete background;

	window.port = chrome.extension.connect({name: "dashboard"});
	port.onMessage.addListener(function(msg) {
		console.log('msg:',msg);
	});
});

})();