(function() {

var User          = namespace.module("user");
var Information   = namespace.module("information");
var NavigationBar = namespace.module("navigationBar");
var Cards         = namespace.module("cards");

ee.on('App::Start',function(){
    $.template( "tabTemplate"    , $('#tabTemplate'));
    $.template( "snippetTemplate", $('#snippetTemplate'));

    console.log('Dashboard.js');

    window.tabz = {};
    tabz.user = (new User.Model).sync();
    tabz.information = new Information.Collection
    tabz.port = new Port;

    tabz.navigation = new NavigationBar.Views.Header({el : 'nav'})
    tabz.cards      = new Cards.Views.Main({el : '#main'})

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

    //Init navigation bar on correct value
    var navigationBarStatus = localStorage.getItem("navigationBar:status");
    if(navigationBarStatus){
        ee.emit('Navigation::Change',{"value":navigationBarStatus});
    }else{
        ee.emit('Navigation::Change',{"value":"current"});
    }
    // End port bindings
});

$(window).load(function(){
    tabz.information.resize();
});

})();