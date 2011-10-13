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
			}else if(request.type == 'mark as read'){
				console.log('mark as read ',request.href);
				var url = request.href;
				tabz.get('readItLater',function(data){
					$.get('https://readitlaterlist.com/v2/send?username='+data.user+'&password='+data.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&read={%220%22:{%22url%22:%22'+url+'%22}}',
					function(d){
						console.log('marked as read',d);
						sendResponse({action:'marked as read'});
					});              
				});
			}else if(request.type == 'get read it now'){
				console.log('Requesting ',request.url);
				$.get('http://text.readitlaterlist.com/v2/text?apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&url='+request.url,
				function(readItNow){
					console.log('Got ',request.url);
					sendResponse({action:'read it now', page:readItNow});
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
			}else if(request.type == 'close tab'){
				chrome.tabs.remove(request.tab.id, function(){});
			}else if(request.type == 'focus on'){
				chrome.tabs.update(request.tab.id, {selected : true}, function(){});
				if(sender.tab.url == "chrome://newtab/"){
					chrome.tabs.remove(sender.tab.id, function(){});
				}				
			}
		
		});
	});
});