/*
 * UB config file
 * We use RequireJS as a module loader http://requirejs.org/docs/api.html
 */
if (typeof requireBaseUrl == 'undefined')
    var requireBaseUrl = '/utilitybelt/utilitybelt';

require.config({
    baseUrl: requireBaseUrl
});

define(function() {
    var coreInit = function() {
        /* Don't change this part if you don't know what you're doing */
        for (var i=0,ii=arguments.length; i<ii; i++) {
            var arg = arguments[i];
            if (arg && arg.type && arg.name && arg.type == 'template')
                core.templates[arg.name.replace('core/templates/', '')] = arg.content;
        }

        // TODO have a localized money formatter and other localized stuff
        // set locale params
        core.locale = core.locales[APP_LANGUAGE];

        // Template settings to integrate in a nice way core frontend with utilitybelt
        _.templateSettings = {
            evaluate    : /\{%([\s\S]+?)%\}/g,
            interpolate : /\{\{(.+?)\}\}/g,
            escape    : /\{%-([\s\S]+?)%\}/g
        };

        core.runtime = {
            persist: function(name, value, serialized) {
                if (serialized === true) {
                    value = JSON.stringify(value);
                }
                $.cookie(name, value, {path: '/'});
            },
            destroy: function() {
                _.each(arguments, function(k) {
                    $.cookie(k, null, {path: '/'});
                });
            },
            fetch: function(name, serialized) {
                var value = $.cookie(name);
                if (serialized === true) {
                    value = JSON.parse(value);
                }
                return value;
            },
            has: function() {
                var me = this,
                    n = 0;
                _.each(arguments, function(k) {
                    n += Boolean(me.fetch(k));
                });
                return arguments.length == n;
            },
            // setup the full auth header now that a token is available
            setupAuthHeader: function(apiKey, token) {
                var authHeader = 'LH api-key=' + apiKey;
                if (token) {
                    authHeader += ',token=' + token;
                }
                $.ajaxSetup({beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('Authentication', authHeader);
                }});
                return authHeader;
            },
            apiKey: '7CaSJr89DeMignxTmdj3cRyVuYwRgNeFjl7L4IHjRf6N3ALZp1LjylqZHOFFYYyuZiLjK92gjvQRdEacDXxDWFHDUCbcWIlk7TXnE9TxSt7Z242BLy5vsNLiwXD0X3Cs'
        };
    };

    return { coreInit: coreInit, coreLibs: [
        /* List of required 3-rd party libraries */
        // JQuery UI http://jqueryui.com/
        'order!lib/jqueryui/1.8.17/jquery-ui.min',
        'order!lib/underscore/1.3.3/underscore',
        'order!lib/backbone/0.9.2/backbone',
        // Backbone-relational.js https://github.com/PaulUithol/Backbone-relational
        'order!lib/backbone-relational/0.5.0/backbone-relational',
        // Underscore String plugin http://epeli.github.com/underscore.string/
        'order!lib/underscore-plugins/string/underscore.string',

        'order!lib/sinon/1.3.2/sinon',
        // 'order!lib/&log/&log',
        'order!lib/jquery-plugins/placeholder/2.0.7/placeholder',
        'order!lib/jquery-plugins/cookie/jquery.cookie',
        // 'order!lib/jquery-plugins/jqTransform/1.0/jquery.jqtransform',
        'order!lib/jquery-plugins/jqTransform/1.0.1dh/jquery.jqtransform.dh',
        'order!lib/jquery-plugins/vtabs/vtabs',

        /* List of UB core files */
        'order!core/namespaces',
        'order!core/config/locales',
        'order!core/config/messages',
        'order!core/config/MapConfig',
        'order!core/utils/Object',
        'order!core/utils/Class',
        'order!core/utils/getText',
        'order!core/utils/getLocale',
        'order!core/utils/Router',
        'order!core/utils/getTemplate',
        'order!core/utils/LS',
        'order!core/utils/Proxy',
        'order!core/utils/formatPrice',
        'order!core/utils/formatItem',
        'order!core/utils/formatAddress',
        'order!core/utils/formatURL',
        'order!core/utils/getUrlParams',
        'order!core/utils/getUrlHash',
        'order!core/utils/getIcon',
        'order!core/utils/buildUrl',
        'order!core/utils/Dom',
        'order!core/utils/redirectLocation',
        'order!core/utils/trackingLogger',

        'order!core/views/View',
        'order!core/views/Box',
        'order!core/views/Lightbox',
        'order!core/views/Form',
        'order!core/views/MapInterface',
        'order!core/views/Page',
        'order!core/views/Tooltip',

        'order!core/mixins/Validate',
        'order!core/mixins/AutosuggestLocations',

        'order!core/collections/Collection',
        'order!core/models/Model',
        // 'order!core/tests/namespaces', //temporary to build list view
        // 'order!core/tests/fixtures/UserAddress', //temporary to build list view
        'order!core/models/Location',
        'order!core/models/Address',
        'order!core/models/DeliveryAddress',
        'order!core/models/CartItem',
        'order!core/models/ItemFlavor',
        'order!core/models/Flavor',
        'order!core/models/Item',
        'order!core/models/ItemSize',
        'order!core/models/Order',
        'order!core/models/OrderGeneral',
        'order!core/models/OrderPriceDetails',
        'order!core/models/Restaurant',
        'order!core/models/Section',
        'order!core/models/Coupon',
        'order!core/models/Payment',
        'order!core/models/User',
        'order!core/models/Authorization',
        'order!core/models/Category',
        'order!core/models/Option',
        'order!core/models/ExitPoll',
        'order!core/collections/Locations',
        'order!core/collections/GeoLocations',
        'order!core/collections/Address',
        'order!core/collections/DeliveryAddress',
        'order!core/collections/Cart',
        'order!core/collections/DeliveryFee',
        'order!core/collections/Order',
        'order!core/collections/Category',
        'order!core/collections/Option',
        'order!core/collections/ExitPoll',
        'order!core/views/Lightbox/Throbber',
        'order!core/views/Form/Login',
        'order!core/views/Form/ExitPoll',
        'order!core/views/Form/Password',
        'order!core/views/View/UserAccountTrigger',
        'order!core/views/Form/UserAddress',
        'order!core/views/Form/Checkout',
        'order!core/views/Form/Filter',
        'order!core/views/Maps/GoogleMaps',
        'order!core/views/View/Cart',
        'order!core/views/Lightbox/Flavors',
        'order!core/views/View/LocationSearch',
        'order!core/views/View/MultipleLocationList',
        'order!core/views/View/UserAddressList',
        'order!core/views/View/ActiveAddress',
        'order!core/views/Lightbox/Login',
        'order!core/views/Lightbox/Password',
        'order!core/views/Lightbox/MultipleLocation',
        'order!core/views/Lightbox/UserAddress',
        'order!core/views/Lightbox/UserAddressList',
        'order!core/views/Lightbox/PasswordForgotten',
        'order!core/views/Lightbox/ZipCodeBox',
        'order!core/views/Lightbox/ChooseBox',
        'order!core/views/Lightbox/Error',
        'order!core/views/Lightbox/ExitPoll',
        'order!core/views/View/Payment',
        'order!core/views/View/Confirmation',
        'order!core/views/Box/Cart',
        'order!core/views/Box/ReadOnlyCart',
        'template!core/templates/Throbber/Throbber.html',
        'template!core/templates/Flavors/flavors.html',
        'template!core/templates/UserAddress/UserAddresses.html',
        'template!core/templates/UserAddress/UserAddressForm.html',
        'template!core/templates/UserAddress/DeleteConfirm.html',
        'template!core/templates/MultipleLocation/MultipleLocation.html',
        'template!core/templates/MultipleLocation/MultipleLocationList.html',
        'template!core/templates/Search/LocationSearchSingle.html',
        'template!core/templates/Cart/Cart.html',
        'template!core/templates/Cart/Item.html',
        'template!core/templates/Cart/Details.html',
        'template!core/templates/Form/ValidationErrors.html',
        'template!core/templates/Lightbox/small.html',
        'template!core/templates/Lightbox/base.html',
        'template!core/templates/Lightbox/close.html',
        'template!core/templates/Box/base.html',
        'template!core/templates/Payment/payment.html',
        'template!core/templates/User/PasswordForgotten.html',
        'template!core/templates/PLZ/zip_code_lightbox.html',
        'template!core/templates/PLZ/choose_lightbox.html',
        'template!core/templates/Filter/FilterForm.html'
    ]};
});
