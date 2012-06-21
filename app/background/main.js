(function() {

var Information = namespace.module("information");
var User = namespace.module("user");

ReadItLater.setApikey('aN2dbH72T2582Es293A5105YbOg9k4eD');

ee.on('App::Start',function(){
    console.log('Everything went to hell, lets build it again...');
    window.tabz = {};
    tabz.user        = (new User.Model).sync();
    tabz.tabListener = new TabListener;
    tabz.information = new Information.Collection;
    tabz.portManager = new PortManager;

    tabz.information.getCurrentInfo(function(data){
        console.log('log', data);
        tabz.information.persist();
    });
});


})();