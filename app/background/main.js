(function() {

var Information = namespace.module("information");
var User = namespace.module("user");

ee.on('App::Start',function(){
    console.log('Everything went to hell, lets build it again...');
    window.tabz = {};

    tabz.user = (new User.Model).sync();
    tabz.information = new Information.Collection;


    tabz.information.getCurrentInfo(function(data){
        console.log('log', data);
        tabz.information.persist();
    });


    window.ports = {};
    chrome.extension.onConnect.addListener(function(port) {
        window.ports[port.portId_] = port;

        port.onDisconnect.addListener(function(data){
            delete window.ports[data.portId_];
        });
    });
});


})();