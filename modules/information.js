(function(Information) {  

    Information.Model = Backbone.Model.extend({
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this;
          
            model.trigger('destroy', model, model.collection, options);

            return null;
        }        
    });

    Information.Collection = Backbone.Collection.extend({
        model : Information.Model,
        name  : 'information',
    	getCurrentInfo :function (callback) {
            var collection = this;

            collection.removeCurrentInfo();
            chrome.windows.getAll({populate : true}, function(windows){
                var list = _.map(windows,function(window){ 
                    return window.tabs
                });
                
                list = _.flatten(list);

                _.each(list,function(tab){
                    tab.type = "current";
                    collection.add(tab);
                });

                if(callback && typeof callback == "function"){
                    callback(list);
                }
            });            
    	},
        removeCurrentInfo :function() {
            var currentTabs = this.filter(function(item){ return item.get('type') == "current"; });
            if(currentTabs.length === 0){
                return;
            }

            for (var i = currentTabs.length - 1; i >= 0; i--) {
                currentTabs[i].destroy();
            };
        },
        resize : function() {         
            var $container   = $('#main'),
                innerWidth   = $container.innerWidth(),
                numberOfTags = Math.floor( innerWidth / 250 );

            $('.tab').width( (innerWidth / numberOfTags) - 1);
            $container.isotope({        
                itemSelector: '.tab'      
            });
        },
        persist : function () {
            localStorage.setItem(this.name, JSON.stringify( this.toJSON() ) );

            return this;
        },
        sync : function () {
            this.reset();
            var data = JSON.parse( localStorage.getItem(this.name) ),
                collection = this;

            _(data).each(function(item){
                collection.add(item)
            });

            return this;
        }

    });

})(namespace.module("information"));