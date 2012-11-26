window.ee = new EventEmitter2({
	wildcard  : true, // should the event emitter use wildcards.
	delimiter : '::' // the delimiter used to segment namespaces, defaults to `.`.
});

ee.on("Port::Tab::create", function (e) {
	e.tab.name = "tab_" + e.tab.id;

	if(!dashboard[e.tab.name]){	
		var tabCard = new TabCard(e.tab);
		tabCard.render(window.dashboard.element); 

		window.dashboard.appendChild(tabCard);

		window.dashboard.setPosition();
	}

});

ee.on("Port::Tab::remove", function (e) {
	ee.emit("Tab::"+ e.tabId +"::remove", e);
});

ee.on("Port::Tab::update", function (e) {
	ee.emit("Tab::"+ e.tabId +"::update", e);
});

$(document).ready(function () {
	console.log('/dashboard/main.js');

	//Compile templates
	$( "#tabCardTemplate" ).template( "tabCardTemplate" );

	window.tabz = {};

	tabz.port = new Port;

	window.dashboard = new Dashboard;
	dashboard.render( $('body') );

	tabz.port.request('tabs/all', {},function(data){
		console.log(data.tabs);
		dashboard.addTabs(data.tabs);
	});
});