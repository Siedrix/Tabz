(function(Cards) {  

    Cards.Views.Main = Backbone.View.extend({
        initialize : function(){
            var cards = this;
            console.log('initialize cards', this);

            ee.on('Navigation::Change', function(e, data){
                cards.currentState = data.value;
                cards.change(data);
            });

            tabz.information.on('add'    , function(item){ 
                if(cards.currentState == 'tab'){
                    cards.renderTab(item);
                }
            });
            //tabz.information.on('remove' , function(e){});
        },
        change : function(data){
            var cardsViews = this;
            var cards = tabz.information.filter(function(model){ return model.get('type') === data.value});
            console.log('Need to render ', data.value, cards);

            cardsViews.$el.html('');

            cards.forEach(function(card){
                console.log(card.get('type'), card.get('url'));

                if(card.get('type') == 'tab'){
                    cardsViews.renderTab(card);
                }else{
                    cardsViews.renderSnippet(card);
                }
            });          

            tabz.information.resize();
        },
        renderTab : function(card){
            card.element = $('<div/>').appendTo( "#main" );
            card.element.html( $.tmpl( "tabTemplate", card.toJSON() ) );
            card.element.data('tab',card.toJSON());

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

            console.log('binding close', card.element.find('.close'));
            card.element.find('.close').click(function(e){
                e.preventDefault();
                e.stopPropagation();
                
                console.log('closing');
                card.requestClose();
            });

            if( !tabz.user.get('username') ){
                card.element.find('.buttons a').show();
            }            
        },
        renderSnippet : function(card){
            card.element = $('<div/>').appendTo( "#main" );
            card.element.html( $.tmpl( "snippetTemplate", card.toJSON() ) );
            card.element.data('tab',card.toJSON());

            card.element.find('> article').click(function(e){
                card.requestOpen();
            });            
        }
    });



})(namespace.module("cards"));