Class('TabzServerApi')({
	serverUrl : 'http://localhost:8090/',
	prototype : {
		init : function (config) {
			this._username = config.user.get("username");
			this._token    = config.user.get("token");
		},
		createSnipet : function(snipet, callback){
			console.log(this._username, this._token);

			$.post(this.constructor.serverUrl + 'api/snipet/create', {
				username : this._username,
				token : this._token,
				title : snipet.title,
				url   : snipet.url
			}, function(snipet){
				console.log('on server api, snipet created:',snipet);
				callback(snipet);
			});
		},
		fetchUnreadSnipets : function(callback){
			$.get(this.constructor.serverUrl + 'api/snipet/fetchUnread', {
				username : this._username,
				token : this._token
			}, function(data){
				console.log(data);
				callback(data);
			});			
		}
	}
});