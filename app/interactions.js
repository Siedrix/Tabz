$(document).ready(function(){
	$('app').bind('dbConnection',function(e,r){
		
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			if(request.type == 'get open tabs'){
				
				tabz.all(function(r){
					r = _.select(r, function(row){ 
						if(row && row.url){return row.url.search('http') == 0;}
					});	
					sendResponse({action:'here are your tabs', tabs:r});
				});
			}else if(request.type == 'add to read it later'){
				tabz.get('readItLater',function(data){
					if(data){

						$.get('https://readitlaterlist.com/v2/add?username='+data.user+'&password='+data.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&url='+request.tab.url+'&title='+request.tab.title,
						function(readItLater){
							chrome.tabs.remove(request.tab.id, function(){});
							sendResponse({action:'pages added', pages: request.tab.id });
						});				
					}else{
					}
				});
			}else if(request.type == 'get read it later'){
				tabz.get('readItLater',function(data){
					if(data){
						$.get('https://readitlaterlist.com/v2/get?username='+data.user+'&password='+data.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&state=unread',
						function(readItLater){
							sendResponse({action:'here are your read it later pages', pages:readItLater.list});
						});
					}else{
						sendResponse({action:'no user'});
					}
				});
			}else if(request.type == 'Log in to read it later'){
				$.get('https://readitlaterlist.com/v2/auth?username='+request.user+'&password='+request.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD',
				function(readItLater,statusCode){
					if(statusCode == "success"){
						tabz.save({key:'readItLater',user:request.user,password:request.password})
						sendResponse({action:'logged in'});
					}else{
						sendResponse({action:'not logged in'});
					}
				});				
			}else if(request.type == 'focus on'){
				chrome.tabs.update(request.tab.id, {selected : true}, function(){});
				if(sender.tab.url == "chrome://newtab/"){
					chrome.tabs.remove(sender.tab.id, function(){});
				}				
			}
		
		});
	});
});