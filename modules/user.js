(function(User) {  

    User.Model = Backbone.Model.extend({

    	logToReadItLater :function () {
    		console.log('Log in to read it later');
    	},
    	requestLogInToReadItLater : function (username, password, callback) {
    		console.log('Request Log in to read it later', username, password, callback);

			chrome.extension.sendRequest({
				type : 'logInToReadItLater',
				username : username,
				password : password
			},function(response) {		
				debugger;
				if(response.action == 'not logged in'){
					alert('Sorry, no log in')
				}else{
					window.location.reload();
				}
			});    		
    	},
    	persist : function () {
    		localStorage.setItem('user', JSON.stringify( this.toJSON() ) );

    		return this;
    	},
    	sync : function () {
    		this.clear();
			this.set( JSON.parse( localStorage.getItem('user') ) );

    		return this;
    	}
    });

})(namespace.module("user"));