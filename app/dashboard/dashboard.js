Class('Dashboard').inherits(Widget)({
	prototype : {
		init : function (config){
			config = config || {};
			config.className = "dashboard";
			Widget.prototype.init.call(this, config);
		},
		addTabs : function (tabs) {
			var dashboard = this;

			_.each(tabs, function(tab){
				tab.name = "tab_" + tab.id;

				var tabCard = new TabCard(tab);
				tabCard.render(dashboard.element); 

				dashboard.appendChild(tabCard);
			});

			this.setPosition();
		},
		setPosition : function () {
			var $container = this.element;

			$container.isotope('destroy');

			var innerWidth = Math.min( $container.innerWidth(), $container.width() );
			var units      = Math.floor( innerWidth / 300);
			var unitWidth  = Math.floor( innerWidth / units );
			$('.tabCard').width( unitWidth )

			$container.isotope({itemSelector: '.tabCard'});
		}
	}
});