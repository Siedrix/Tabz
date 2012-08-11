Class(ServerApi, 'DataPoint')({
    _request  : function(url, method, data){
        var url = this.parseUrl(url);

        data.username = data.username || tabz.user.get('username');
        data.token    = data.token    || tabz.user.get('token');
        data.type     = this.className;

        var config = {
            url    : url,
            data   : data,
            type   : method
        }

        console.log('Request data point update', config);
        xhr = $.ajax(config);

        xhr.done(function(data){ console.log('success', data); });
        xhr.fail(function(data){ console.log('error', data);   });

        return xhr;
    },
    baseUrl   : "data-point",
    parseUrl  : function(url){
        return tabz.serverApi.constructor.serverUrl + 'api/' + this.baseUrl + '/' + url; 
    },
    prototype : {
        init   : function () {},
        create : function (data) {
            console.log('sending create with', data);
            var url    = 'create';
            var method = 'POST';

            return this.constructor._request(url, method, data);
        },
        update : function (data) {
            var url    = 'update';
            var method = 'POST';

            return this.constructor._request(url, method, data);
        },
        query : function(query){
            var url    = 'query';
            var method = 'POST';

            return this.constructor._request(url, method, query);
        }
    }   
});