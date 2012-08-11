(function() {
console.log('Setting backbone background page sync');

var createUUID = function() {
    //http://ajaxian.com/archives/uuid-generator-in-javascript
    var s = [], itoh = '0123456789ABCDEF';

    // Make array of random hex digits. The UUID only has 32 digits in it, but we
    // allocate an extra items to make room for the '-'s we'll be inserting.
    for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

    // Conform to RFC-4122, section 4.4
    s[14] = 4;  // Set 4 high bits of time_high field to version
    s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

    // Convert to hex chars
    for (var i = 0; i <36; i++) s[i] = itoh[s[i]];

    // Insert '-'s
    // s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
}

Backbone.BackgroundPage = function(serverApi) {
    this.create  = function(model) {
        console.log('Create', model, createUUID);

        var modelId = createUUID()
        model.set('id', modelId);
        model.set('new', true);
        model.set('dirty', true);

        // persist model on local storage
        var modelAsString = JSON.stringify( model.toJSON() );
        localStorage.setItem( model.name + '-' + modelId, modelAsString );

        // 

        // var xhr = tabz.serverApi[model.name || model.collection.name].create( model.toJSON() );

        // xhr.done(function(data){ 
        //     model.set('id', data.snippet.id);
        //     model.id = data.snippet.id;
        // });

        // return xhr;
    };
    this.update  = function(model) {
        console.log('Calling model update with', model);

        model.set('dirty', true);

        // persist model on local storage
        var modelId = model.get('id');
        var modelAsString = JSON.stringify( model.toJSON() );
        localStorage.setItem( model.name + '-' + modelId, modelAsString );

        // var xhr = tabz.serverApi[model.name || model.collection.name].create( model.toJSON() );

        // return xhr;
    };
    this.find    = function(model) {
        console.log('find', model);
    };
    this.query   = function(query) {
        console.log('Quering', query);

        // var xhr = tabz.serverApi.dataPoint.query(query)
        // return xhr;
    }
    this.findAll = function() {
        console.log('find all');
    };
    this.destroy = function(model) {
        console.log('destroy', model);

        var modelId = model.get('id');
        localStorage.removeItem( model.name + '-' + modelId );
    };
};

window.backgroundPageSync = new Backbone.BackgroundPage;

Backbone.BackgroundPage.sync = function(method, model, options, error) {
    console.log('calling sync',method, model, options, error);
    
    var resp;

    switch (method) {
        case "read": 
            if( model.id != undefined ){
                resp = backgroundPageSync.find(model);
            }else if(options.query){
                resp = backgroundPageSync.query(options.query);
            }else{
                resp = backgroundPageSync.findAll();
            }
                 
            break;
        case "create":  resp = backgroundPageSync.create(model);                            break;
        case "update":  resp = backgroundPageSync.update(model);                            break;
        case "delete":  resp = backgroundPageSync.destroy(model);                           break;
    }

    console.log('resp',resp);
    if (resp) {
        options.success(resp);
    } else {
        options.error("Record not found");
    }
};

Backbone.sync = Backbone.BackgroundPage.sync
})();