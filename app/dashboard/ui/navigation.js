(function(NavigationBar) {  

    NavigationBar.Views.Header = Backbone.View.extend({
        events : {
            'click .clickable' : 'change'
        },
        name : 'navigationBar',
        initialize : function(){
            console.log('initialize navigationBar', this);
        },
        change : function(e, data){
            var $target = $(e.target),
                value   = $target.attr('value');
                
            ee.emit('Navigation::Change',{"value":value});
            localStorage.setItem(this.name + ":status", value);
        }
    });



})(namespace.module("navigationBar"));