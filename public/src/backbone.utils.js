(function() {

    //Extends collection object;
    _.extend( Backbone.Collection.prototype, {
        findById : function (id) {
            return this.find(function(item){
                return item.id == id
            });
        },
        bindEvents : function(events,ee){
            var collection = this;

            _.each(events, function(handler, event){
                console.log(event, collection[handler]);
                ee.on(event, function(e, data){
                    collection[handler](data, e);
                });
            });
        }
    })
    
})();