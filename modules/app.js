(function(App) {  

    App.Model = Backbone.Model.extend({});

    App.Collection = Backbone.Collection.extend({
        model : App.Model,
        load : function () {
        	var collection = this;

			chrome.management.getAll(function(data){
				apps = _(data).chain().select(function(app){
					if(app.isApp){
						return app
					}
				}).value()

				collection.add(apps);
        		console.log('Loaded chrome apps');
			});			        	
        }
    });

})(namespace.module("app"));