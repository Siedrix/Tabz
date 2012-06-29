(function(Information) {  

    Information.Model = Backbone.Model.extend({
        element : null,
        events : {
            'click .buttons a': 'saveForLater'
        },
        initialize: function() {
            var model = this;
        },
        requestSaveForLater : function(){
            tabz.port.postMessage('Snippet::Create',this.toJSON(),function(data){});
        },
        requestClose : function(){
            tabz.port.postMessage('Tab::Close',this.toJSON(),function(data){});
        },
        requestFocus : function(){
            tabz.port.postMessage('Tab::Focus',this.toJSON(),function(data){});  
        },
        requestOpen : function(){
            tabz.port.postMessage('Tab::Open',this.toJSON(),function(data){});    
        },
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this;
          
            model.trigger('destroy', model, model.collection, options);

            if($.tmpl){
                this.element && this.element.remove();
            }

            return null;
        }        
    });

    Information.Collection = Backbone.Collection.extend({
        model : Information.Model,
        name  : 'information',
        events : {
            'Tab::create'   : 'tabCreate',
            'Tab::loading'  : 'tabLoading',
            'Tab::complete' : 'tabComplete',
            'Tab::remove'   : 'tabRemove'
        },
        initialize: function() {
            var collection = this;

            this.bindEvents(this.events, ee);
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
                    tab.type = "tab";
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
        tabCreate : function(data){
            data.tab.type = 'tab';
            console.log('tabCreate', this, data);
            this.add(data.tab);
            this.persist();            

            return this;
        },
        tabLoading : function(data){
            console.log('tabLoading', this, data);

            if(data && data.url){
                var model = this.findById(data.tabId);
                console.log('Added loading tab', data, model.toJSON() );
                model.set({
                    type   : 'tab',
                    status : "loading",
                    url    : data.url
                });
            }
            this.persist();            

            return  this;
        },
        tabComplete : function(data){
            console.log('tabComplete', this, data);

            var model = this.findById(data.tabId);

            if(model && data.tab){
                console.log('Added completed tab');
                data.type = 'tab';
                model.set(data.tab);
            }
            this.persist(); 
            
            return this;           
        },
        tabRemove : function(data){
            console.log('tabRemove', this, data);

            var model = this.findById(data.tabId);
            this.remove(model);
            this.persist();
            return this;            
        },
        resize : function() {         
            console.log('start resize');
            var $container   = $('#main'),
                innerWidth   = $container.innerWidth(),
                numberOfTags = Math.floor( innerWidth / 250 );

            debugger;
            $('.tab, .snippet').width( (innerWidth / numberOfTags) - 1);

            if( $container.hasClass('isotope') ){
                $container.isotope( 'reloadItems');
            }

            $container.isotope({        
                itemSelector: '.tab, .snippet'      
            });
            console.log('end resize');
        },
        close  : function (tabId) {
            chrome.tabs.remove(tabId);

            return this;
        },
        focus : function (tabId) {
            chrome.tabs.update(tabId, {active:true})

            return this;
        },
        syncUnread : function(){
            var collection = this;

            tabz.serverApi.fetchUnreadSnippets(function(data){
                console.log(collection, data);

                tabz.information.filter(function(model){
                    return model.get('type') == 'snippet' && model.get('status') == 'not-read'
                }).forEach(function(snippet){
                    snippet.destroy();
                })

                _.each(data.snippets, function(snippet){
                    console.log('snippet',snippet);

                    collection.add(snippet);
                });

                collection.persist();
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