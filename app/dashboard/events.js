$(document).ready(function(){
	$('#main').delegate('.buttons .add','click',function(e){
		var tab = $(this).closest('.tab');

		if(!tab.hasClass('procesing')){
			e.stopPropagation();
			e.preventDefault();

			tab.addClass('procesing');

			chrome.extension.sendRequest({
				type : 'add to read it later',
				tab : tab.data('tab')
			},function(response) {		
				tab.remove();
			});
		}
	});	

	$("#main").delegate(".tab", "click", function(){
		chrome.extension.sendRequest({
			type : 'focus on',
			tab  : $(this).data('tab')
		},function(response) {});
	});

	$("#main").delegate(".tab .close", "click", function(e){
		e.stopPropagation();

		var tab = $(this).closest('.tab');
		tab.addClass('procesing');

		chrome.extension.sendRequest({
			type : 'close tab',
			tab  : tab.data('tab')
		},function(response) {});
		tab.remove();
	});

	$("#controls").delegate("#markAsRead", "click", function(){
		console.log('Sending mask as read')
		chrome.extension.sendRequest({
			type : 'mark as read',
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

	$('nav').delegate('#logInToReadLater button','click',function(){
		var user = $("#logInToReadLater #user").val();
		var password = $("#logInToReadLater #password").val();
		chrome.extension.sendRequest({
			type : 'Log in to read it later',
			user : user,
			password : password
		},function(response) {		
			if(response.action == 'not logged in'){
				
			}else{
				window.location.reload()
			}
		});		
	});

	$('#pages').delegate('a','click',function(e){
		e.preventDefault()
		var link = this;
		$('body').data('openUri',link.href);
		chrome.extension.sendRequest({
			type : 'get read it now',
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