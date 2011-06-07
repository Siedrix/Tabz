$(document).ready(function(){
	$('app').bind('dbConnection',function(e,r){
		console.log('interactions running');
		
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			if(request.type == 'get open tabs'){
				console.log('Getting all tabs');
				
				tabz.all(function(r){
					r = _.select(r, function(row){ 
						if(row){return row.url.search('http') == 0;}
					});	
					console.log(r)
					sendResponse({action:'here are your tabs', tabs:r});
				});
				
			}else if(request.type == 'focus on'){
				console.log(request, sender);
				chrome.tabs.update(request.tab.id, {selected : true}, function(){});
				if(sender.tab.url == "chrome://newtab/"){
					chrome.tabs.remove(sender.tab.id, function(){});
				}				
			}
		
		});
	});
});