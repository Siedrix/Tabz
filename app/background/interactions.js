$(document).ready(function(){
	$('app').bind('dbConnection',function(e,r){
		
		window.ports = {};
		chrome.extension.onConnect.addListener(function(port) {
			window.ports[port.portId_] = port;

			port.onDisconnect.addListener(function(data){
				delete window.ports[data.portId_];
			});
		})

		chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			if(request.type,sender.tab.url){
				console.log('ee',request.type,sender.tab.url);
				ee.emit('Dashboard::'+request.type,request, sender, sendResponse);
			}
		});

	    ee.on('Dashboard::*',function(e,request, sender, sendResponse) {
	    	console.log('got:',e,request, sender);
	    	if(ee.listeners('Dashboard::'+request.type).length == 0){
	    		sendResponse({action:'invalid', error: 'No way to process the request'});	
	    		console.log('Invalid Request:',e,request, sender);
	    	}
	    });		

		ee.on('Dashboard::getOpenTabs',function(e,request, sender, sendResponse) {
    		tabz.all(function(r){
				r = _.select(r, function(row){ 
					if(row && row.url){return row.url.search('http') == 0;}
				});	
				sendResponse({action:'here are your tabs', tabs:r});
			});
	    });

		ee.on('Dashboard::addToReadItLater',function(e,request, sender, sendResponse) {
			tabz.get('readItLater',function(data){
				if(data){
					$.get('https://readitlaterlist.com/v2/add?username='+data.user+'&password='+data.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&url='+request.tab.url+'&title='+request.tab.title,
					function(readItLater){
						chrome.tabs.remove(request.tab.id, function(){});
						sendResponse({action:'pages added', pages: request.tab.id });
					});				
				}
			});
		});

		ee.on('Dashboard::markAsRead',function(e,request, sender, sendResponse) {
			var url = request.href;
			tabz.get('readItLater',function(data){
				$.get('https://readitlaterlist.com/v2/send?username='+data.user+'&password='+data.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&read={%220%22:{%22url%22:%22'+url+'%22}}',
				function(d){
					console.log('marked as read',d);
					sendResponse({action:'marked as read'});
				});              
			});			
		});

		ee.on('Dashboard::getReadItNow',function(e,request, sender, sendResponse) {
			$.get('http://text.readitlaterlist.com/v2/text?apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&url='+request.url,
			function(readItNow){
				console.log('Got ',request.url);
				sendResponse({action:'read it now', page:readItNow});
			});			
		});

		ee.on('Dashboard::getChromeApps',function(e,request, sender, sendResponse) {
			chrome.management.getAll(function(data){
				apps = _(data).chain().select(function(app){
					if(app.isApp){
						return app
					}
				}).value()

				sendResponse({action:'here are your chrome apps', apps:apps});
			});			
		});			

		ee.on('Dashboard::getChromeBookmarks',function(e,request, sender, sendResponse) {
			chrome.bookmarks.getTree(function(b){
				var bookmarks =[],data;
				//Flat bookmark tree into an array, remove javascript bookmarkelts;
				var flat = function(data){
					if( _.isArray(data) ){
						_(data).each(function(item){
							flat(item);
						})
					}else if( data.children){
						flat(data.children)
					}else if( data.url && data.url.indexOf('javascript') != 0 ){
						bookmarks.push(data);
					}
				}
				flat(b);
				
				sendResponse({action:'here are your chrome bookmarks', bookmarks:bookmarks});
			});
		});					

		ee.on('Dashboard::getReadItLater',function(e,request, sender, sendResponse) {
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
		});

		ee.on('Dashboard::logInToReadItLater',function(e,request, sender, sendResponse) {
			$.get('https://readitlaterlist.com/v2/auth?username='+request.user+'&password='+request.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD',
			function(readItLater,statusCode){
				if(statusCode == "success"){
					tabz.save({key:'readItLater',user:request.user,password:request.password})
					sendResponse({action:'logged in'});
				}else{
					sendResponse({action:'not logged in'});
				}
			});
		});			

		ee.on('Dashboard::closeTab',function(e,request, sender, sendResponse) {
			chrome.tabs.remove(request.tab.id, function(){});
		});		
		
		ee.on('Dashboard::focusOn',function(e,request, sender, sendResponse) {
			chrome.tabs.update(request.tab.id, {selected : true}, function(){});
			if(sender.tab.url == "chrome://newtab/"){
				chrome.tabs.remove(sender.tab.id, function(){});
			}							
		});				

	});
});