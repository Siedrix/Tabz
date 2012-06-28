(function(Cards) {  

    Cards.Views.Main = Backbone.View.extend({
        initialize : function(){
            var cards = this;
            console.log('initialize cards', this);

            ee.on('Navigation::Change', function(e, data){
                cards.change(data);
            });            
        },
        change : function(data){
            var cardsViews = this;
            var cards = tabz.information.filter(function(model){ return model.get('type') === data.value});
            console.log('Need to render ', data.value, cards);

            cardsViews.$el.html('');

            cards.forEach(function(card){
                console.log(card.get('url'));

                card.element = $('<div/>');

                if(card.get('type') != 'snipet'){
                    cardsViews.renderTab(card)
                }
            });          

            tabz.information.resize();
        },
        renderTab : function(card){
            card.element.html( $.tmpl( "tabTemplate", card.toJSON() ) );
            card.element.data('tab',card.toJSON()).appendTo( "#main" );

            card.bind('change', function(){                    
                card.element.html( $.tmpl( "tabTemplate", card.toJSON() ) );
                console.log('calling resize');
                tabz.information.resize();
            }); 
            
            card.element.find('> article').click(function(e){
                card.requestFocus();
            });

            card.element.find('.buttons a').click(function(e){
                e.preventDefault();
                e.stopPropagation();
                
                card.requestSaveForLater();
            });

            card.element.find('.close').click(function(e){
                e.preventDefault();
                e.stopPropagation();
                
                card.requestClose();
            });

            if( !tabz.user.get('username') ){
                card.element.find('.buttons a').show();
            }            
        }
    });



})(namespace.module("cards"));