$(document).ready(function(){
	$.template( "tabTemplate", $('#tabTemplate'));
	$.template( "pagesTemplate", $('#pagesTemplate'));
	$.template( "logInToReadLaterTemplate", $('#logInToReadLaterTemplate'));
	$.template( "appsTemplate", $('#appsTemplate'));
	$.template( "bookmarksTemplate", $('#bookmarksTemplate'));

	$(window).resize(function() {
		$('nav').jScrollPane();
	});

	var Tabz = {
		actions : {},
		db : null//Lawnchair db
	};

	Tabz.db = new Lawnchair('tabz',function(){
		console.log('DB ready to rock',this);
	});

	Tabz.actions.requestReadItLater = function(){	
		chrome.extension.sendRequest({
			type : 'getReadItLater'
		},function(response){
			if(response.action == 'no user'){
				$('#pages').html('').attr('class','');
				$('nav').attr('class','');				
				$.tmpl( "logInToReadLaterTemplate", {} ).appendTo( "#pages" );
			}else{		
				$('#pages').html('').attr('class','');
				$('nav').attr('class','');
				$.each(response.pages, function(i, item){
					//$('#main').append('<li>'+item.title+'<p>'+item.text+'</p></li>')
					$('body').data('readItLater',{user:true});
					$('.buttons	.add').show();
					var $container = $('#main');
					$container.isotope({        
						itemSelector: '.tab'      
					});			
					$.tmpl( "pagesTemplate", item ).data('page',item).appendTo( "#pages" );		
					$('nav').jScrollPane().addClass('readItLater');
				});		
			}
		});
		Tabz.db.save({key:'currentTab',tab:'ReadItLater'});
	}

	Tabz.actions.requestChromeBookmarks = function(){
		chrome.extension.sendRequest({
			type : 'getChromeBookmarks'
		},function(response){
			console.log(response);
			$('#pages').html('');
			$('nav').attr('class','');			
			$.each(response.bookmarks, function(i, item){
				$.tmpl( "bookmarksTemplate", item ).data('app',item).appendTo( "#pages" );
				$('nav').jScrollPane().addClass('chromeBookmarks');
			});									
		});

		Tabz.db.save({key:'currentTab',tab:'ChromeBookmarks'});
	}

	Tabz.actions.requestChromeApps = function(){	
		chrome.extension.sendRequest({
			type : 'getChromeApps'
		},function(response){
			console.log(response);
			$('#pages').html('');
			$('nav').attr('class','');
			$.each(response.apps, function(i, item){			
				$.tmpl( "appsTemplate", item ).data('app',item).appendTo( "#pages" );		
				$('nav').jScrollPane().addClass('chromeApps');
			});						
		});
		Tabz.db.save({key:'currentTab',tab:'ChromeApps'});
	}	

	
	chrome.extension.sendRequest({
		type : 'getOpenTabs'
	},function(response) {
		$.each(response.tabs, function(i, item){
			console.log('Tab:',item)
			$.tmpl( "tabTemplate", item ).data('tab',item).appendTo( "#main" );
			if($('body').data('readItLater') && $('body').data('readItLater').user){
				$('.buttons	.add').show();
			}
		});
		var $container = $('#main');
		$container.isotope({        
			itemSelector: '.tab'      
		});          		

		Tabz.db.get('currentTab',function(data){
			if(data == null){
				Tabz.actions.requestChromeApps();
			}else{
	  			Tabz.actions['request' + data.tab ]()
			}
		});
	});

	window.Tabz = Tabz;

	var background = localStorage.getItem('background');
	if(background){
		console.log('Set new background', background);
		$('body').css('background-image', 'url('+background+')');
	}
	delete background;

});
