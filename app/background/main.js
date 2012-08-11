(function() {

var Information = namespace.module("information");
var User = namespace.module("user");
var DataPoint = namespace.module("data-point");

ReadItLater.setApikey('aN2dbH72T2582Es293A5105YbOg9k4eD');

ee.on('App::Start',function(){
    console.log('Everything went to hell, lets build it again...');
    window.tabz = {};
    tabz.user        = (new User.Model).sync();
    tabz.tabListener = new TabListener;
    tabz.information = new Information.Collection;
    tabz.dataPoint   = new DataPoint.Collection;
    tabz.portManager = new PortManager;
    tabz.serverApi   = new ServerApi({
        user : tabz.user
    });

    tabz.information.getCurrentInfo(function(data){
        console.log('current tabz: Done!!');
        tabz.information.persist();
    });

    // Fetch local storage models
    for (key in localStorage){
        var model = key.split('-')[0];
        var id    = key.split('-')[1];
        if(tabz[ model ] && id){
            console.log(localStorage.getItem( key ));

            var data = JSON.parse( localStorage.getItem( key ) );

            tabz[ model ].add(data)
        }
    }

    tabz.information.syncUnread(function(data){
        console.log('unread snippets: Done!!');
        tabz.information.persist();
    });

    ee.on('Port::Snippet::Create',function(e,data){
        tabz.serverApi.createSnippet(data, function(snippet){
            console.log('data',data, snippet);
            chrome.tabs.remove(data.id);
        });
    });

    ee.on('Port::Snippet::MarkAsRead',function(e,data){
        var snippet = tabz.information.findById(data._id);

        console.log(e, snippet);

        snippet.set('status', 'read');
        snippet.set('type'  , 'bookmark');
        
        snippet.save();        
    });  

    ee.on('Port::Snippet::FetchUnread', function(e, data){
        tabz.serverApi.fetchUnreadSnippets(function(snippets){
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

    ee.on('Port::Tab::Open', function(e, data){
        chrome.tabs.create({
            url    : data.url,
            active : true
        });
    });
});


})();