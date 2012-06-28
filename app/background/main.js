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
    tabz.serverApi = new TabzServerApi({
        user : tabz.user
    });

    tabz.information.getCurrentInfo(function(data){
        console.log('current tabz: Done!!');
        tabz.information.persist();
    });

    tabz.information.syncUnread(function(data){
        console.log('unread snippets: Done!!');
        tabz.information.persist();  
    });

    ee.on('Port::Snippet::Create',function(e,data){
        tabz.serverApi.createSnipet(data, function(snippet){
            console.log('data',data, snippet);
            chrome.tabs.remove(data.id);
        });
    });

    ee.on('Port::Snippet::FetchUnread', function(e, data){
        tabz.serverApi.fetchUnreadSnipets(function(snippets){
            console.log('snippets', data.port, snippets);
            
            data.port.postMessage({
                type      : 'Snippet::FetchUnread',
                messageId : data.messageId,
                snippets  : snippets
            });
        });         
    });

    ee.on('Port::Tab::Close', function(e, data){
        tabz.information.close(data.id);
    });

    ee.on('Port::Tab::Focus', function(e, data){
        tabz.information.focus(data.id); 
    });
});


})();