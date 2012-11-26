Class('Port')({
    prototype : {
        _port : null,
        _callbacks : {},
        init : function (config) {
            console.log('Port init', config);
            var port = this;

            this._port = chrome.extension.connect({name: "dashboard"});
            this._port.onMessage.addListener(function(msg) {
                var message;

                if(typeof msg === "string"){
                    message = JSON.parse(msg);
                }else{
                    message = msg;
                }

                if(message.messageId && port._callbacks[message.messageId]){
                    port._callbacks[message.messageId](message);
                }

                console.log('got message', message);

                ee.emit('Port::'+message.type,message);
            });
        },
        postMessage : function(type, data, callback){
            data = data || {};

            data.type = type;
            data.messageId = _.uniqueId('message-');

            if(callback){
                this._callbacks[data.messageId] = callback;
            }

            console.log('posting', data);
            this._port.postMessage(data);
        },
        request : function (request, data, callback) {
            data = data || {};

            data.type = request;
            data.requestType = 'singleReguest';
            data.messageId = window.utils.UUID();

            if(callback){
                this._callbacks[data.messageId] = callback;
            }

            this._port.postMessage(data);
        }

    }
});