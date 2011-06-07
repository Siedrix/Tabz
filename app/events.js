//Diz file watches for all the browser event to keep the elements on the data base current
$(document).ready(function(){
	$('app').bind('dbConnection',function(e,r){
		console.log('Events Running');
		
		chrome.tabs.onCreated.addListener(function(tab){
			console.log('Tab created',tab.id);
			tab.key = tab.id;
			tabz.save(tab);
		});
		
		chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
			tabz.get(tabId+'.0',function(r){
				console.log('removing tab',tabId);
				tabz.remove(r)
			});
		});
		
		chrome.tabs.onUpdated.addListener(function(tabId,updateInfo) {
			if(updateInfo.status== "complete"){
				chrome.tabs.get(tabId, function(tab){
					tab.key = tab.id;
					tabz.save(tab);
					console.log('Tab update completed');
				});
			}
		});
	});
});