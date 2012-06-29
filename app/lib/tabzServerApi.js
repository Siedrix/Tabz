Class('TabzServerApi')({
	serverUrl : 'http://localhost:8090/',
	prototype : {
		init : function (config) {
			this._username = config.user.get("username");
			this._token    = config.user.get("token");
		},
		createSnippet : function(snippet, callback){
			console.log(this._username, this._token);

			$.post(this.constructor.serverUrl + 'api/snippet/create', {
				username : this._username,
				token : this._token,
				title : snippet.title,
				url   : snippet.url
			}, function(snippet){
				console.log('on server api, snippet created:',snippet);
				callback(snippet);
			});
		},
		fetchUnreadSnippets : function(callback){
			$.get(this.constructor.serverUrl + 'api/snippet/fetchUnread', {
				username : this._username,
				token : this._token
			}, function(data){
				console.log(data);
				callback(data);
			});			
		}
	}
});