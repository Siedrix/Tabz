(function(ReadItLater) {  

    ReadItLater.Model = Backbone.Model.extend({});

    ReadItLater.Collection = Backbone.Collection.extend({
        model : ReadItLater.Model,
        lastUpdate : null,//int
        load : function () {
        	var collection = this;
        	
        	collection._reset();
			console.log('Loading from read it later');

			if( tabz.user.get('hasReadItLater') ){
				$.get('https://readitlaterlist.com/v2/get?username='+tabz.user.get('username')+'&password='+tabz.user.get('password')+'&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD&state=unread',
				function(readItLater){
					_.each(readItLater.list, function(item, key){
						item.id = key; 
						delete item.item_id; 

						collection.add(item)
					});

					collection.lastUpdate = (new Date).getTime();
				});				
			}else{
				throw "No read it later user"
			}

        }
    });

})(namespace.module("readItLater"));