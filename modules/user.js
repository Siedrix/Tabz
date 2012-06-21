(function(User) {  

    User.Model = Backbone.Model.extend({
        events : {
            'Port::LogInToReadItLater' : 'logInToReadItLater'
        },
        initialize : function(){
            console.log('init user');
            if(typeof ReadItLater != "undefined"){
                this._readItLater = new ReadItLater;
            }

            this.bindEvents(this.events, ee);
        },
        addToken : function(token){
            this.set('token', token);

            return this;
        },
        logInToReadItLater :function (user) {
            var model = this,
                messageId = user.messageId,
                port = user.port;

            delete user.port;
            delete user.messageId;
            delete user.type;

            this._readItLater.checkAuth(user, function(status){
                if(status == "success"){
                    user.status = "success";
                    model.set(user);
                    model.persist();

                    tabz.portManager.broadcast({type: 'Login', messageId: messageId, status: "success"});
                }
            });
        },
        requestLogInToReadItLater : function (username, password, callback) {
            console.log('Request Log in to read it later', username, password, callback);

            tabz.port.postMessage('LogInToReadItLater',{
                username : username,
                password : password
            },function(response) {      
                if(response.success == 'invalid'){
                    alert('Sorry, no log in')
                }else{
                    tabz.user.sync();
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