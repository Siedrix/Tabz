(function() {

var User        = namespace.module("user");
var Information = namespace.module("information");

ee.on('App::Start',function(){
    $.template( "tabTemplate", $('#tabTemplate'));
    $.template( "pagesTemplate", $('#pagesTemplate'));
    $.template( "logInToReadLaterTemplate", $('#logInToReadLaterTemplate'));
    $.template( "appsTemplate", $('#appsTemplate'));
    $.template( "bookmarksTemplate", $('#bookmarksTemplate'));

    console.log('Dashboard.js');

    window.tabz = {};
    tabz.user = (new User.Model).sync();
    tabz.information = (new Information.Collection)
    tabz.port = new Port;

    // tabz.information.bind('add', function(item){
    //     $.tmpl( "tabTemplate", item.toJSON() ).data('tab',item.toJSON()).appendTo( "#main" )
    // })

    tabz.information.sync();    

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


});

$(window).load(function(){
    tabz.information.resize();
});

})();