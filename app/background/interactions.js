$(document).ready(function(){

	// DONE
	window.ports = {};
	chrome.extension.onConnect.addListener(function(port) {
		window.ports[port.portId_] = port;

		port.onDisconnect.addListener(function(data){
			delete window.ports[data.portId_];
		});
	})

	// DONE
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if(request.type,sender.tab.url){
			//console.log('ee',request.type,sender.tab.url);
			ee.emit('Dashboard::'+request.type,request, sender, sendResponse);
		}
	});

	// DONE
	ee.on('Background::Create',function(e,tab){
		console.log('** Tab New',tab, _.isEmpty(ports), ports);
		if( !_.isEmpty(ports) ){
			console.log('notifing dashboards');
			_(ports).each(function(port) {
				port.postMessage(tab);
			});
		};
	});

	// DONE
	ee.on('Background::Update',function(e,tab){
		console.log('** Tab Updated',tab, _.isEmpty(ports), ports);
		if( !_.isEmpty(ports) ){
			console.log('notifing dashboards');
			_(ports).each(function(port) {
				port.postMessage(tab);
			});
		};
	});		

	// DONE
    ee.on('Dashboard::*',function(e,request, sender, sendResponse) {
    	//console.log('got:',e,request, sender);
    	if(ee.listeners('Dashboard::'+request.type).length == 0){
    		sendResponse({action:'invalid', error: 'No way to process the request'});	
    		console.log('Invalid Request:',e,request, sender);
    	}
    });		

    // DONE
	ee.on('Dashboard::getOpenTabs',function(e,request, sender, sendResponse) {
		console.log('Got request for all tabz');
		sendResponse({action:'here are your tabs', tabs:tabz.chrome.toJSON() });
    });

    // DONE
	ee.on('Dashboard::addToReadItLater',function(e,request, sender, sendResponse) {
		console.log('Got request to send a tab to read it later');

    	// TODO: Move to all this logic to a method
		if( tabz.user.get('hasReadItLater') ){
			$.get('https://readitlaterlist.com/v2/add?username='+tabz.user.get('username')+'&password='+tabz.user.get('password')+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&url='+request.tab.url+'&title='+request.tab.title,
			function(readItLater){
				chrome.tabs.remove(request.tab.id, function(){});
				tabz.readItLater.load();

				sendResponse({action:'pages added', pages: request.tab.id });
			});
		}

	});

	// TODO
	ee.on('Dashboard::markAsRead',function(e,request, sender, sendResponse) {
		console.log('Got requesto to mark as read', request);
		var url = request.href;

		if( tabz.user.get('hasReadItLater') ){
			$.get('https://readitlaterlist.com/v2/send?username='+tabz.user.get('username')+'&password='+tabz.user.get('password')+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&read={%220%22:{%22url%22:%22'+url+'%22}}',
			function(d){
				tabz.readItLater.load()
				sendResponse({action:'marked as read'});
			});              
		}
	});

	// DONE
	ee.on('Dashboard::getReadItNow',function(e,request, sender, sendResponse) {

		// TODO move this logic to a method, prefetch
		$.get('http://text.readitlaterlist.com/v2/text?apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&url='+request.url,
		function(readItNow){
			//console.log('Got ',request.url);
			sendResponse({action:'read it now', page:readItNow});
		});			
	});

	// DONE
	ee.on('Dashboard::getChromeApps',function(e,request, sender, sendResponse) {
		sendResponse({action:'here are your chrome apps', apps: tabz.app.toJSON() });	
	});			

	// DONE
	ee.on('Dashboard::getChromeBookmarks',function(e,request, sender, sendResponse) {	
		sendResponse({action:'here are your chrome bookmarks', bookmarks:tabz.bookmarks.toJSON()});
	});					

	// DONE
	ee.on('Dashboard::getReadItLater',function(e,request, sender, sendResponse) {
		console.log('Got request to get all read it later info');

		//TODO Add expire cache
		sendResponse({action:'here are your read it later pages', pages:tabz.readItLater.toJSON() });
	});

	// DONE
	ee.on('Dashboard::logInToReadItLater',function(e,request, sender, sendResponse) {

		//Move this method to a user module for read it later
		$.get('https://readitlaterlist.com/v2/auth?username='+request.username+'&password='+request.password+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD')
		.success(function(readItLater,statusCode) {
			if(statusCode == "success"){
				tabz.user.set({
					"hasReadItLater" : true,
					"username" : request.username,
					"password" : request.password
				}).persist();
				console.log('Success',readItLater,statusCode);
				sendResponse({action:'logged in'});
			}else{
				sendResponse({action:'not logged in'});	
			}
		})
        .error(function(data) { 
	        console.log('error',data) 
         	sendResponse({action:'not logged in'});
	    });

	});			

	// DONE
	ee.on('Dashboard::closeTab',function(e,request, sender, sendResponse) {
		chrome.tabs.remove(request.tab.id, function(){});
	});
	
	// DONE
	ee.on('Dashboard::focusOn',function(e,request, sender, sendResponse) {
		chrome.tabs.update(request.tab.id, {selected : true}, function(){});
		if(sender.tab.url == "chrome://newtab/"){
			chrome.tabs.remove(sender.tab.id, function(){});
		}							
	});

});