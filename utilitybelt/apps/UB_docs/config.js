
/*
 * Sample config file
 * We use RequireJS as a module loader http://requirejs.org/docs/api.html
 */
var requireBaseUrl = "/utilitybelt";
require.config({
    baseUrl: requireBaseUrl + '/utilitybelt'
});

require([

/* Include Web UI library */
      'core/config'
], function(core) {

    require([

/* Inlcude application files */

         'order!apps/UB_docs/namespaces'
         , 'order!apps/UB_docs/config/messages'
         , 'order!apps/UB_docs/pages/Page'
         , 'order!core/tests/fixtures/Locations' 

    ], function() {

        core.Proxy('local');
        core.messages.de = _.extend(core.messages.de, docs.messages.de);

/* Call router, which will create the instance of the relevant page */

        var AppRouter = Backbone.Router.extend({
                routes: {
                    "*actions": "defaultRoute",
                    ":actions/:tab": "defaultRoute" 
                },
                defaultRoute: function( url, tab ){
                    new docs.Page({ url: url || 'core.views.Lightbox', tab: tab || 'documentation' });
/*
                    if (!url)
                        url = 'core.views.Lightbox';
                    var class_name = 'docs.' + url.replace(/\./gi, '_');
                    try {
                        eval('new ' + class_name + '({ url: url })');
                    }
                    catch (ex) {
                        console.error('Cannot instantiate ' + class_name);
                    }
*/
                }
            });

        core.app_router = new AppRouter();
        
        Backbone.history.start();

//        core.Router('docs.Home');

    })
});

var APP_LANGUAGE = 'de';
