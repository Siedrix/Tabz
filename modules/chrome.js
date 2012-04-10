(function(Chrome) {  

    Chrome.Model = Backbone.Model.extend({});

    Chrome.Collection = Backbone.Collection.extend({
        model : Chrome.Model,
        load : function () {
        	var collection = this;
			chrome.windows.getAll({populate : true}, function(windows){
				var list = _.map(windows,function(window){ 
					return window.tabs
				});
				
				list = _.flatten(list);

				_.each(list,function(tab){
					collection.add(tab);
				});
			});
        }
    });

})(namespace.module("chrome"));