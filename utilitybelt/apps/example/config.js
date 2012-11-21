
/*
 * Sample config file
 * We use RequireJS as a module loader http://requirejs.org/docs/api.html
 */

require.config({
    baseUrl: '/utilitybelt'
});

require([

/* Include Web UI library */

      'webui/config'
    , 'tests/namespaces'
], function(webui) {
    require([

/* Inlcude application files */

         'order!apps/example/pages/Page'
         , 'order!apps/example/pages/Home'

    ], function() {

/* Call router, which will create the instance of the relevant page */
        webui.Router('example.Home');

    })
});

var APP_LANGUAGE = 'de';
