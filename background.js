window.ee = new EventEmitter2({
	wildcard  : true, // should the event emitter use wildcards.
	delimiter : '::' // the delimiter used to segment namespaces, defaults to `.`.
});

window.tabz = {};
tabz.providers = {};

tabz.portManager = new PortManager;

tabz.providers.chromeTabs = new TabListener;
tabz.providers.chromeTabs.load();
tabz.providers.chromeTabs.bindToChrome();

tabz.portManager.on('tabs/all', function(message, port){
	message.tabs = tabz.providers.chromeTabs.all();

	port.postMessage(message);
});

tabz.portManager.on('tabs/focus', function (message, port) {
	chrome.tabs.update(message.tabId, {active:true});

	message.success = true;
	port.postMessage(message);
});

tabz.portManager.on('tabs/close', function (message, port) {
	chrome.tabs.remove(message.tabId);

	message.success = true;
	port.postMessage(message);	
})

ee.on('Tab::create', function(e){tabz.portManager.broadcast(e)});
ee.on('Tab::remove', function(e){tabz.portManager.broadcast(e)});
ee.on('Tab::update', function(e){tabz.portManager.broadcast(e)});