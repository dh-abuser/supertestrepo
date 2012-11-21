/*
 * Sample config file
 * We use RequireJS as a module loader http://requirejs.org/docs/api.html
 */

var ifPhantom = navigator.userAgent.toString().indexOf('PhantomJS') >= 0;
var requireBaseUrl = window.location.pathname.replace('/tests/jasmine/SpecRunner.html', '');

require.config({
    baseUrl: requireBaseUrl,
    waitSeconds: 30
});

if (typeof dev_require_config != 'undefined')
    require.config(dev_require_config);

var lh_data = {
    global_path_prefix: ''
}

require(['core/config', 'lib/jquery/1.7.1/jquery.min'], function(config) {

    require(config.coreLibs, function() {

        config.coreInit(core);

        require([
        /* Include Web UI library */
              'core/config'
            , 'order!apps/Frontend_AU/namespaces'
            , 'order!apps/Frontend_AU/config/messages'
            , 'order!apps/Frontend_AU/pages/Page'
            , 'order!apps/Frontend_AU/pages/LoggedIn'
            , 'order!lib/jasmine/1.1.0/jasmine'
            , 'order!lib/jasmine/1.1.0/jasmine-html'
            , 'order!lib/jasmine/1.1.0/jasmine-jquery'
            , 'order!lib/jasmine/1.1.0/jasmine-junit'
            , 'order!lib/jasmine/1.1.0/jasmine-phantom'
            , 'order!lib/sinon/1.3.2/sinon'
            , 'tests/jasmine/namespaces'

        ], function(tests) {
            require([

        /* Inlcude test spec's files */
                'order!core/tests/fixtures/Item'
                , 'order!core/tests/fixtures/UserAddress'
                , 'order!core/tests/fixtures/User'

                , 'order!core/tests/models/Address'
                , 'order!core/tests/models/Model'
                , 'order!core/tests/models/Item'
                , 'order!core/tests/models/CartItem'
                , 'order!core/tests/models/Order'
                , 'order!core/tests/models/User' 

                , 'order!core/tests/collections/Cart'
                , 'order!core/tests/collections/Collection'
                , 'order!core/tests/collections/GeoLocations'
                , 'order!core/tests/collections/ExitPoll'

                , 'order!core/tests/mixins/Validate'

                , 'order!core/tests/views/View/Cart'
                , 'order!core/tests/views/View/UserAddressList'
                , 'order!core/tests/views/View/Payment' // pls fix async
                , 'order!core/tests/views/Lightbox/MultipleLocation'
                , 'order!core/tests/views/Lightbox/Lightbox'
                , 'order!core/tests/views/Lightbox/Flavors'
                , 'order!core/tests/views/View/MultipleLocationList'
                , 'order!core/tests/views/View/ActiveAddress'
                , 'order!core/tests/views/Throbber/Throbber'
                , 'order!core/tests/views/Form/UserAddress'
                , 'order!core/tests/views/Maps/GoogleMaps'
                , 'order!core/tests/views/Form/Filter'
                , 'order!core/tests/views/View/LocationSearch'
                , 'order!core/tests/views/Form/ExitPoll'

                , 'order!core/tests/pages/LoggedIn'

            ], function() {

        /* Configure Jasmine and execute tests  */
                Backbone.Relational.showWarnings = false; 
                var reporter = (ifPhantom)? new jasmine.PhantomJSReporter(): new jasmine.TrivialReporter();
                jasmine.getEnv().addReporter(reporter); 
                jasmine.getEnv().execute();

            })
        });

    });
});


var APP_LANGUAGE = 'de';
var APP_API_MODE = 'local';
