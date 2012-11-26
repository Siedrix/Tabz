Class('TabCard').inherits(Widget)({
	ELEMENT : '<div class="card"></div>',
	prototype : {
		init : function (config){
			config = config || {};
			config.className = "tabCard";			
			Widget.prototype.init.call(this, config);

			this.setContent($.tmpl( "tabCardTemplate", this ));

			this.bindEvents();
		},
		bindEvents : function () {
			var tabCard = this;

			this.element.click(function(e){
				if($(e.target).hasClass('close')){
					tabz.port.request('tabs/close', {tabId : tabCard.id},function(data){
						tabCard.destroy();
					});					
				}else{
					tabz.port.request('tabs/focus', {tabId : tabCard.id},function(data){
						window.close();
					});					
				}
			});

			window.ee.on("Tab::"+ tabCard.id +"::remove", function (e) {
				tabCard.destroy();
			});

			window.ee.on("Tab::"+ tabCard.id +"::update", function (e) {
				_.each(e.tab, function(item, key){
					tabCard[key] = item;
				});

				tabCard.setContent($.tmpl( "tabCardTemplate", tabCard ));
			});
		}

	}
});