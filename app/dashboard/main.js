(function() {

var User          = namespace.module("user");
var Information   = namespace.module("information");
var NavigationBar = namespace.module("navigationBar");

ee.on('App::Start',function(){
    $.template( "tabTemplate", $('#tabTemplate'));

    console.log('Dashboard.js');

    window.tabz = {};
    tabz.user = (new User.Model).sync();
    tabz.information = new Information.Collection
    tabz.port = new Port;

    tabz.navigation = new NavigationBar.Views.Header({el : 'nav'})

    tabz.information.sync();

    // Port bindings
    // Move to port object
    ee.on('Port::*',function(e,data){
        console.log('Port got message', e, data );
    });

    ee.on('Port::Remove',function(e,data){
        var model = tabz.information.findById(data.model.id)

        if(model){
            model.destroy();
        }
    });

    ee.on('Port::Add',function(e,data){
        tabz.information.add(data.model);
        tabz.information.resize();
    });

    ee.on('Port::Change',function(e,data){
        var model = tabz.information.findById(data.model.id);
        if(model){
            model.set(data.changes);
        }
    });
    // End port bindings
});

$(window).load(function(){
    tabz.information.resize();
});

})();