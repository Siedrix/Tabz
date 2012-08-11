(function(DataPoint) {  

    DataPoint.Model = Backbone.Model.extend({
        name : 'dataPoint'
    });

    DataPoint.Collection = Backbone.Collection.extend({
        name : 'dataPoint',
        model : DataPoint.Model,
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
        tabCreate : function(data){
            console.log('tabCreate');

            data.tab.type = 'tab';
            this.add(data.tab);  

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

            return this;
        },
        tabComplete : function(data){
            console.log('tabComplete');

            var model = this.findById(data.tabId);

            if(model && data.tab){
                console.log('Added completed tab');
                data.type = 'tab';
                model.set(data.tab);
            }            

            return this;            
        },
        tabRemove : function(data){
            console.log('tabRemove');

            var model = this.findById(data.tabId);
            this.remove(model);

            return this;
        }
    });

})(namespace.module("data-point"));