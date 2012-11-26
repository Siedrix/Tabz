Class('TabListener')({
	prototype : {
		_tabs : {},
		init : function (config) {
			console.log('tab listener init', config);

			this._tabs = {};
		},
		bindToChrome : function () {
			var tabsListener = this;

			chrome.tabs.onCreated.addListener(function(tab){
				tabsListener.add(tab);
				ee.emit('Tab::create', {tab:tab, type: "Tab::create"});
			});

			chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
				tabsListener.remove(tabId);
				ee.emit('Tab::remove', {tabId:tabId,removeInfo:removeInfo, type: 'Tab::remove'});
			});

			chrome.tabs.onUpdated.addListener(function(tabId,updateInfo) {
				chrome.tabs.get(tabId, function(tab){
					tabsListener.update(tabId, updateInfo);
					ee.emit('Tab::update', {tabId:tabId, tab: tab, type: 'Tab::update'});	
				});
			});
		},
		load : function (callback) {
			var tabsListener = this;

            chrome.windows.getAll({populate : true}, function(windows){
                var list = _.map(windows,function(window){ 
                    return window.tabs
                });
                
                list = _.flatten(list);

                _.each(list,function(tab){
                    tabsListener.add(tab);
                });

                if(callback && typeof callback == "function"){
                    callback(list);
                }
            });			
		},
		all : function () {
			return this._tabs;	
		},
		add : function (tab) {
	        tab.type = "tab";
            this._tabs[tab.id] = tab;
			
            return this;
		},
		remove : function (tabId) {
			delete this._tabs[tabId];

			return this;
		},
		update : function (tabId, updateInfo) {
			if(this._tabs[tabId]){
				this._tabs[tabId] = _.extend(this._tabs[tabId], updateInfo);
			}

			return this;
		}
	}
})