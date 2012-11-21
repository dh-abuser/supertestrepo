/**
 * Price details section from the Order Model
 * @see http://mockapi.lieferheld.de/doc/reference/users/user_orders_details.html#order-price-details
 */
core.define('core.models.OrderPriceDetails', {
    extend: 'core.Model',

    fields: {
        'min_order_value': { 'dataType': 'number', 'default': 0 },
        'subtotal': { 'dataType': 'number', 'default': 0 },
        'difference': { 'dataType': 'number', 'default': 0 },
        'delivery_fee': { 'dataType': 'number', 'default': 0 },
        'price': { 'dataType': 'number', 'default': 0 },
        'coupon_fee': { 'dataType': 'number', 'default': 0 },
        'total_price': { 'dataType': 'number', 'default': 0 }
    },

    initialize: function() {
        core.models.OrderPriceDetails.__super__.initialize.apply(this, arguments);
    },

    set: function(key, value, options) {
        core.models.OrderPriceDetails.__super__.set.call(this, key, value, options);
        return this.updatePriceDetails(options);
    },

    /**
    * Update price details by re-evaluating and setting the value of computed properties.
    * @ref http://mockapi.lieferheld.de/beta/doc/reference/users/user_orders_details.html#order-price-details
    */
    updatePriceDetails: function(options) {
        var min_order_value = this.get('min_order_value'),
            subtotal = this.get('subtotal'),
            coupon_fee = this.get('coupon_fee'),
            delivery_fee = this.get('delivery_fee');

        var difference = subtotal < min_order_value ? min_order_value - subtotal : 0;
        var price = subtotal + coupon_fee + delivery_fee;
        var total_price = price + difference; //this is equal to either price, or min_order_value
        core.models.OrderPriceDetails.__super__.set.call(this, {
            difference: difference,
            price: price,
            total_price: total_price
        }, options);
        return this;
    },

    hasFee: function() {
        return this.attributes['delivery_fee']
            || this.attributes['min_order_value']
            || this.attributes['coupon_fee'];
    }
});
