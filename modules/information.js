(function(Information) {  

    Information.Model = Backbone.Model.extend({
        element : null,
        initialize: function() {
            var model = this;

            if($.tmpl){
                this.element = $('<div/>')
                this.element.html( $.tmpl( "tabTemplate", this.toJSON() ) );
                this.element.data('tab',this.toJSON()).appendTo( "#main" );

                this.bind('change', function(){                    
                    this.element.html( $.tmpl( "tabTemplate", this.toJSON() ) );
                    console.log('calling resize');
                    tabz.information.resize();
                });
            }
        },
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this;
          
            model.trigger('destroy', model, model.collection, options);

            if($.tmpl){
                this.element.remove();
            }

            return null;
        }        
    });

    Information.Collection = Backbone.Collection.extend({
        model : Information.Model,
        name  : 'information',
        initialize: function() {
            var collection = this;
            if(typeof ee != "undefined"){
                console.log('Binding information collection to ee');

                ee.on('Tab::create'   , function(e,data){ 
                    console.log(e,data); 
                    collection.add(data.tab);
                    collection.persist();
                });
                ee.on('Tab::loading'  , function(e,data){ 
                    console.log(e,data); 

                    if(data && data.url){
                        var model = collection.findById(data.tabId);
                        model.set({
                            status : "loading",
                            url : data.url
                        });
                    }
                    collection.persist();
                });
                ee.on('Tab::complete' , function(e,data){ 
                    console.log(e,data); 

                    var model = collection.findById(data.tabId);

                    if(model && data.tab){
                        model.set(data.tab);
                    }
                    collection.persist();
                });
                ee.on('Tab::remove'   , function(e,data){ 
                    console.log(e,data); 

                    var model = collection.findById(data.tabId);
                    collection.remove(model);
                    collection.persist();
                });
            }
        },
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
            console.log('start resize');
            var $container   = $('#main'),
                innerWidth   = $container.innerWidth(),
                numberOfTags = Math.floor( innerWidth / 250 );

            $('.tab').width( (innerWidth / numberOfTags) - 1);

            if( $container.hasClass('isotope') ){
                $container.isotope( 'reloadItems');
            }

            $container.isotope({        
                itemSelector: '.tab'      
            });
            console.log('end resize');
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