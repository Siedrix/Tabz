(function() {
    var binder = function(events,ee){
        var self = this;

        _.each(events, function(handler, event){
            ee.on(event, function(e, data){
                self[handler](data, e);
            });
        });
    }

    //Extends collection object;
    _.extend( Backbone.Collection.prototype, {
        findById : function (id) {
            return this.find(function(item){
                return item.id == id
            });
        },
        bindEvents : binder
    });

    _.extend( Backbone.Model.prototype, {
        bindEvents : binder  
    });
    
})();