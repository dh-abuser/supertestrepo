/**
 * Coupon Model, represents a coupon to be used when placing an order.
 */
core.define('core.models.Coupon', {

    extend: 'core.Model',

    idAttribute: false,

    fields: {
        'code': { 'dataType': 'string' }
    }
});
