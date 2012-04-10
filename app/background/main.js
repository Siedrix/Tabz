(function() {

var Chrome      = namespace.module("chrome");
var ReadItLater = namespace.module("readItLater");
var Bookmark = namespace.module("bookmark");
var App = namespace.module("app");

var User = namespace.module("user");

ee.on('App::Start',function(){
    console.log('Everything went to hell, lets build it again...');
    window.tabz = {};

    tabz.user = (new User.Model).sync();

    tabz.chrome = new Chrome.Collection();
    tabz.chrome.load();

    tabz.bookmarks = new Bookmark.Collection();
    tabz.bookmarks.load();    

    tabz.app = new App.Collection();
    tabz.app.load();

    tabz.readItLater = new ReadItLater.Collection();
    tabz.readItLater.load();
});


})();