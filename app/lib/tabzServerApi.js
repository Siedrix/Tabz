Class('TabzServerApi')({
	serverUrl : 'http://localhost:8090/',
	prototype : {
		init : function (config) {
			this._username = config.user.get("username");
			this._token    = config.user.get("token");
		},
		createSnipet : function(snipet){
			console.log(this._username, this._token);

			$.post(this.constructor.serverUrl + 'api/snipet/create', {
				username : this._username,
				token : this._token,
				title : 'Simple Made Easy',
				url   : 'http://www.infoq.com/presentations/Simple-Made-Easy'
			}, function(data){
				console.log(data);
			});
		}
	}
});