(function() {

    //Extends collection object;
    _.extend( Backbone.Collection.prototype, {
        findById : function (id) {
            return this.find(function(item){
                return item.id == id
            });
        }
    })
    
})();