
/*
 * Proxy
 * @param {string} mode Proxy mode, can be 'local' or 'api'
 * In 'local' mode requests to Backbone.sync are served through the LocalStorage
 * In 'api' mode requests to Backbone.sync are served through the mock API engine, using the SinonJs fakeServer
 */

core.Proxy = function(mode, debug) {

    this.modes = {};

/**
* Simple LocalStorage-based proxy. When enabled, all requests to Backbone.sync are served through the LocalStorage.
*/

    this.modes.local = function() {
        Backbone.serverSync = Backbone.sync;

        Backbone.sync = function(method, model, options) {

            var delay = 300; // to imitate back-end delay
            var tbname = model.self, id = model.id, counter = localStorage.getItem(tbname + '-counter') || 0;

            if (model.model) {  // collection
                tbname = new model.model().self;
                if (method == 'read') {
                    var recs = [];
                    for (var field in localStorage) {
                        var id = field.replace(tbname + '-', '');
                        if (id.match(/^\d$/)) {
                            var rec = JSON.parse(localStorage.getItem(field));
                            rec.id = id;
                            if (rec.address != null){
                                if (rec.address == model.getUrlParams()['searchAddress']){
                                    recs.push(rec);
                                }
                            } else {
                                recs.push(rec)
                            }
                            
                        }
                    }
                    setTimeout(function() { options.success({ data: recs }) }, delay);
                }
            }
            else { // single model

            if (method == 'create') {
                    id = ++counter;
                model.id = id;
                localStorage.setItem(tbname + '-counter', id);
            }

            if (method == 'create' || method == 'update') {
                localStorage.setItem(tbname + '-' + id, JSON.stringify(model.attributes));
            }

            var rec = JSON.parse(localStorage.getItem(tbname + '-' + id));
            rec.id = id;
            
            if (method == 'delete') {
                localStorage.removeItem(tbname + '-' + id);
            }

                setTimeout(function() { options.success(rec) }, delay);

            }

        };
    }

/**
* Fake API mimicking the Lieferheld's REST API. When enabled, all ajax calls to the '/api/...' urls will be served through the Sinon fakeServer (see http://sinonjs.org/docs/#server).
* Uses LocalStorage as a persistent storage for the records. For now do not support the authorization. 
*/
    
    this.modes.api = function(debug) {
        sinon.FakeXMLHttpRequest.useFilters = true;
        sinon.FakeXMLHttpRequest.addFilter(function (method, url, async, username, password) {
            if (url.indexOf('/api/') < 0)
                return true;
            else {
                console.log('Sinon API call: ' + url, method);
            }
        });

        var processRequest = function (xhr, url) {
            var tmp = url.split(/\?(.*)$/), query = (tmp[1] || '').split('&'), record = JSON.parse(xhr.requestBody);
            var url = tmp[0].split('/'), method = xhr.method, tbname = url[0], respond = {}; 
            var search_param = query[0].split('='), search_key = search_param[0], search_value = search_param[1];
            var ls = new core.LSDB();
            if (!url[1]) { // /users
                if (method == 'POST') {
                    if (debug == 1) 
                        console.log('create in ' + tbname);
                    ls.insert(tbname, record);
                    respond = record;
                }
                else if (method == 'GET') {
                    if (debug == 1) 
                        console.log('select from ' + tbname);
                    var callback = (search_key!='' && search_value!='')? 
                        function(rec) {
                            return rec[search_key] == search_value;
                        }
                        : function(rec) {
                            return true;
                        }
                    respond = ls.selectAll(tbname, callback);
                }
            }
            else if (!url[2]) { // /users/u1
                var id = url[1];
                if (method == 'PUT') {                                 
                    if (debug == 1) 
                        console.log('update ' + tbname + ' with id ' + id);
                    ls.update(tbname, id, record);
                    respond = record;
                }
                else if (method == 'GET') {
                    if (debug == 1) 
                        console.log('read ' + tbname + ' with id ' + id);
                    respond = ls.select(tbname, id);
                }
            }
            else if (!url[3]) { // /users/u1/orders/
                var parent_id = url[1], child_tbname = url[2];
                if (method == 'POST') {
                    if (debug == 1) 
                        console.log('create in ' + child_tbname + ' for ' + tbname + ' with id ' + parent_id);
                    record.parent_id = parent_id;
                    ls.insert(child_tbname, record);
                    respond = record; 
                }
                else if (method == 'GET') {
                    if (debug == 1) 
                        console.log('list ' + child_tbname + ' for ' + tbname + ' with id ' + parent_id);
                    respond = { data: ls.selectAll(child_tbname, function(rec) { return rec.parent_id == parent_id; }) };
                }
            }
            else { // /users/u1/orders/o1/
                var parent_id = url[1], child_tbname = url[2], child_id = url[3];
                if (method == 'PUT') {
                    if (debug == 1) 
                        console.log('update ' + child_tbname + ' with id ' + child_id + ' for ' + tbname + ' with id ' + parent_id);
                    record.parent_id = parent_id;
                    ls.update(child_tbname, child_id, record);
                    respond = record;
                }
                else if (method == 'GET') {
                    if (debug == 1) 
                        console.log('read ' + child_tbname + ' with id ' + child_id + ' for ' + tbname + ' with id ' + parent_id);
                    respond = ls.select(child_tbname, child_id, function(rec) { return rec.parent_id == parent_id; });
                }
            }

            var headers = { "Content-Type": "application/json" }, responseCode;

            if (search_key) {
                for (var i=0,ii=respond.length;i<ii;i++) {
                    var save = respond[i];
                    respond[i] = { };
                    respond[i][search_key] = save;
                }
            }
            
            if (respond && !respond.data)
                respond = { data: respond };

            if (!respond) {
                respond = '{"errors": [{"cause": "", "error_message": "The object specified by the given parameters could not be found.", "error_code": "617"}]}';
                responseCode = 617;
            }
            else {
                respond = JSON.stringify(respond);
                responseCode = 200;
            }

            xhr.respond(responseCode, headers, respond);

        }

        var srv = sinon.fakeServer.create();

        srv.autoRespond = true;
        srv.autoRespondAfter = 500;
        srv.respondWith(/\/api\/(.*)$/, processRequest);
    }

    if (this.modes[mode])
        this.modes[mode](debug);
    else {
        if (Backbone.serverSync) { // if overridden
            Backbone.sync = Backbone.serverSync;
        }

        Backbone.old_sync = Backbone.sync

        Backbone.sync = function(method, model, options) { // this is a stub for a futher Auth implementation (if needed)
            var new_options =  _.extend({
                beforeSend: function(xhr) {
/*                    var token = $('meta[name="csrf-token"]').attr('content');
                    if (token) */
                    xhr.setRequestHeader('Authentication', 'LH api-key=<API KEY>');
                }
            }, options)
            Backbone.old_sync(method, model, new_options);
        };

    }
}
