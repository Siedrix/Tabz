(function() {

var User        = namespace.module("user");
var Information = namespace.module("information");

$(document).ready(function(){
	$.template( "tabTemplate", $('#tabTemplate'));
	$.template( "pagesTemplate", $('#pagesTemplate'));
	$.template( "logInToReadLaterTemplate", $('#logInToReadLaterTemplate'));
	$.template( "appsTemplate", $('#appsTemplate'));
	$.template( "bookmarksTemplate", $('#bookmarksTemplate'));

	console.log('Dashboard.js');

    window.tabz = {};
    tabz.user = (new User.Model).sync();
    tabz.information = (new Information.Collection)

    tabz.information.bind('add', function(item){
    	console.log('adding', item);
    	$.tmpl( "tabTemplate", item.toJSON() ).data('tab',item.toJSON()).appendTo( "#main" )
    })

    tabz.information.sync();

    window.port = chrome.extension.connect({name: "dashboard"});
    port.onMessage.addListener(function(msg) {
        console.log('msg:',msg);
    });    
});

$(window).load(function(){
	tabz.information.resize();
});

})();