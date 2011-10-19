$(document).ready(function(){
	$('#main').delegate('.buttons .add','click',function(e){
		var tab = $(this).closest('.tab');

		if(!tab.hasClass('procesing')){
			e.stopPropagation();
			e.preventDefault();

			tab.addClass('procesing');

			chrome.extension.sendRequest({
				type : 'addToReadItLater',
				tab : tab.data('tab')
			},function(response) {		
				tab.remove();
			});
		}
	});	

	$("#main").delegate(".tab", "click", function(){
		chrome.extension.sendRequest({
			type : 'focusOn',
			tab  : $(this).data('tab')
		},function(response) {});
	});

	$("#main").delegate(".tab .close", "click", function(e){
		e.stopPropagation();

		var tab = $(this).closest('.tab');
		tab.addClass('procesing');

		chrome.extension.sendRequest({
			type : 'closeTab',
			tab  : tab.data('tab')
		},function(response) {});
		tab.remove();
	});

	$("#controls").delegate("#markAsRead", "click", function(){
		console.log('Sending mask as read')
		chrome.extension.sendRequest({
			type : 'markAsRead',
			href : $('body').data('openUri')
		},function(response) {
			console.log('Marked as read');
			$('#content').hide();
			$('#content').find('#header').html('');
			$('#content').find('#entry').html('');
			$('box').hide();
			$('body').data('openUri','')
		});
	});	

	$("#controls").delegate("#close", "click", function(){
		console.log('Closing');
		$('#content').hide();
		$('#content').find('#header').html('');
		$('#content').find('#entry').html('');
		$('box').hide();
		$('body').data('openUri','')
	});		

	$('tabs').delegate('div','click',function(){
		var action = this.id.replace('tab-','');
		console.log('Click on tabs:',action);
		if(action == 'readItLater'){
			console.log('Request Read It Later');
			Tabz.actions.requestReadItLater();
		}else if(action == 'chromeApps'){
			console.log('Request Chrome Apps');
			Tabz.actions.requestChromeApps();
		}else if(action == 'chromeBookmarks'){
			console.log('Request Chrome Bookmarks');
			Tabz.actions.requestChromeBookmarks();
		}else{
			console.log('No action register');
		}
	});

	$('nav').delegate('#logInToReadLater button','click',function(){
		var user = $("#logInToReadLater #user").val();
		var password = $("#logInToReadLater #password").val();
		chrome.extension.sendRequest({
			type : 'logInToReadItLater',
			user : user,
			password : password
		},function(response) {		
			if(response.action == 'not logged in'){
				
			}else{
				window.location.reload()
			}
		});		
	});

	$('#pages').delegate('.readItLaterTab a','click',function(e){
		e.preventDefault()
		var link = this;
		$('body').data('openUri',link.href);
		chrome.extension.sendRequest({
			type : 'getReadItNow',
			url  : this.href
		},function(response) {		
			console.log('Read Now',response);
			$('#content').css({
				width : '660px',
				display : 'block'
			});

			$('#content').find('#entry') .html(response.page);
			$('#content').find('#header').html(link.innerHTML);
			$('box').show();

		});		
	});
		
	$('#button').click(function(){
		$('#tabs').html('');
		chrome.extension.sendRequest({
			type  : 'search in tabs',
			query : $('#search').val()
		},function(response) {
			$.each(response.tabs, function(i, item){
				$.tmpl( "tabTemplate", item ).data('tab',item).appendTo( "#main" )
			});
			var $container = $('#main');
			$container.isotope({        
				itemSelector: '.tab'      
			});
		});		
	});
});