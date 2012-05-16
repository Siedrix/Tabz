Class('Port')({
    prototype : {
        port : null,
        init : function (config) {
            console.log('Port manager init', config);

            this.port = chrome.extension.connect({name: "dashboard"});
            this.port.onMessage.addListener(function(msg) {
                var message = JSON.parse(msg);

                ee.emit('Port::'+message.type,message);
            });
        }
    }
});