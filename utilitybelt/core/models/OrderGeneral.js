/**
 * "General" section from the Order Model 
 * @see http://mockapi.lieferheld.de/doc/reference/users/user_orders_details.html#general
 */
core.define('core.models.OrderGeneral', {

    extend: 'core.Model',

    fields: {
        'created_at': { 'dataType': 'datetime' },
        'coupon_fee': { 'dataType': 'number' },
        'delivery_fee': { 'dataType': 'number', 'default': 0 },
        'min_order_fee': { 'dataType': 'number', 'default': 0 },
        'price': { 'dataType': 'number', 'default': 0 },
        'restaurant_id': { 'dataType': 'string' },
        'restaurant_uri': { 'dataType': 'string' },
        'submitted_at': { 'dataType': 'datetime' },
        'arriving_at': { 'dataType': 'datetime' },
        'user_id': { 'dataType': 'string' },
        'user_uri': { 'dataType': 'string' }
    },

    validations: [
//        { field: 'user_id', type: 'required', message_key: 'user_id_required' }
    ],

    initialize: function() {
        core.models.OrderGeneral.__super__.initialize.call(this);
    },

    /**
     * Returns a lightweight dumb object representing the instance.
     * Stripped down to comply with API and consume less weight.
     * @return {Object} A lightweight and dumb representation of the instance
     */
    toJSON: function() {
        return {
            restaurant_id: this.get('restaurant_id'),
            user_id: this.get('user_id')
        };
    }
});
