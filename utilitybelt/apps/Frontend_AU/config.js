/*
 * Config file
 * We use RequireJS as a module loader http://requirejs.org/docs/api.html
 */
var requireBaseUrl = '/utilitybelt/utilitybelt';

require.config({
    baseUrl: requireBaseUrl,
    waitSeconds: 30
});

require(['core/config'], function(config) {

    require(config.coreLibs, function() {

        config.coreInit.apply(core, arguments);

        require([
            /* Inlcude application files */
            'order!apps/Frontend_AU/namespaces',
            'order!apps/Frontend_AU/config/messages',
            'order!apps/Frontend_AU/pages/Page',
            'order!apps/Frontend_AU/pages/Menu',
            'order!apps/Frontend_AU/pages/Checkout',
            'order!apps/Frontend_AU/pages/RestaurantList',
            'order!apps/Frontend_AU/pages/RestaurantListOpen',
            'order!apps/Frontend_AU/pages/LoggedIn',
            'order!apps/Frontend_AU/pages/Confirm',
            'order!apps/Frontend_AU/pages/LandingPage',
            'order!core/tests/fixtures/Locations'
        ], function() {
            core.messages.au = _.extend(core.messages.en, core.messages.au);
            if (typeof(lh_data) == 'undefined') {
                lh_data = {};
            }
            if (!lh_data.current_page) {
                lh_data.current_page = 'app.Home';
            }
            core.Router(lh_data.current_page, lh_data);
        });
    });

});

var APP_LANGUAGE = 'au';
