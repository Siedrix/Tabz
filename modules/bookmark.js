(function(Bookmarks) {  

    Bookmarks.Model = Backbone.Model.extend({});

    Bookmarks.Collection = Backbone.Collection.extend({
        model : Bookmarks.Model,
        load : function () {
        	var collection = this;

			chrome.bookmarks.getTree(function(b){
				var bookmarks =[],data;

				//Flat bookmark tree into an array, remove javascript bookmarkelts;
				var flat = function(data){
					if( _.isArray(data) ){
						_(data).each(function(item){
							flat(item);
						})
					}else if( data.children){
						flat(data.children)
					}else if( data.url && data.url.indexOf('javascript') != 0 ){
						bookmarks.push(data);
					}
				}
				flat(b);

				collection.add(bookmarks);
				console.log('Bookmarks loaded');
			});        	
        }
    });

})(namespace.module("bookmark"));