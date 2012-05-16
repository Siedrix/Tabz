Class('TabListener')({
	prototype : {
		init : function (config) {
			console.log('tab listener init', config);

			chrome.tabs.onCreated.addListener(function(tab){
				ee.emit('Tab::create', {tab:tab});
			});

			chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
				ee.emit('Tab::remove', {tabId:tabId,removeInfo:removeInfo});
			});

			chrome.tabs.onUpdated.addListener(function(tabId,updateInfo) {
				if(updateInfo.status == "loading" ){
					ee.emit('Tab::loading', {tabId:tabId,url:updateInfo.url});	
				}else{
					chrome.tabs.get(tabId, function(tab){
						ee.emit('Tab::complete', {tabId:tabId, tab: tab});	
					});
				}
			})
		}
	}
})