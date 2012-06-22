Class('ReadItLater')({
    _apikey : null,
    _urls : {
        login : 'https://readitlaterlist.com/v2/auth?username={:username}&password={:password}&apikey=aN2dbH72T2582Es293A5105YbOg9k4eD' 
    },
    setApikey : function(apikey){
        this._apikey = apikey;

        return this;
    },
    compileUrl : function(url, data){
        var url = this._urls[url];

        url = url.replace(/{:(\w+)}/g, function($0,$1){return data[$1]});

        return url;
    },
    prototype : {
        init : function(){
            console.log('init read it later');
        },
        checkAuth : function(user, callback){
            var url = this.constructor.compileUrl('login', user);

            $.get(url)
            .success(function(readItLater,statusCode) {
                if(statusCode == "success"){
                    callback("success");
                }else{
                    callback("invalid")
                }
            });
        }
    }
})