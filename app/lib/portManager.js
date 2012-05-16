Class('PortManager')({
    prototype : {
        _ports : {},
        init : function (config) {
            console.log('Port manager init', config);
            var portManager = this;

            // This content should be move outside this class in case we meed a portManager independent 
            // from the tabz.information collection and the chrome.extension objects
            tabz.information.bind('add', function(model){
                portManager.broadcast({
                    type  : 'Add',
                    model : model.toJSON()
                });
            });

            tabz.information.bind('change', function(model){
                portManager.broadcast({
                    type    : 'Change',
                    model   : model.toJSON(),
                    changes : model.changedAttributes()
                });
            });

            tabz.information.bind('remove', function(model){
                portManager.broadcast({
                    type    : 'Remove',
                    model   : model.toJSON()
                });
            });

            chrome.extension.onConnect.addListener(function(port) {
                console.log('port conected');
                portManager.addPort(port)
            });
            // content ends
        },
        addPort : function(port){
            var portManager = this;         

            this._ports[port.portId_] = port;

            port.onDisconnect.addListener(function(data){
                portManager.removePort(data);
            });
            port.onMessage.addListener(function (data) {
                portManager.onMessage(data);
            });

            return this;
        },
        removePort : function(data){
            delete this._ports[data.portId_];
        },
        broadcast : function(msg){
            var portManager = this;
                        
            if(! _.isEmpty(this._ports) ){
                if(!msg.type){
                    console.warn('cant send messages without type');
                    return;
                }

                _.each(this._ports,function(port){
                    if(portManager._ports[ port.portId_ ]){
                        port.postMessage( JSON.stringify(msg) );
                    }
                })
            }
        },
        onMessage : function(msg){
            console.log('got',msg);
        }
    }
});