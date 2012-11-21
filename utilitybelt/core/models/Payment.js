/**
 * Payment Model, represents a payment method for an order.
 */
core.define('core.models.Payment', {

    extend: 'core.Model',

    idAttribute: false,

    fields: {
        'gateway': { 'dataType': 'object' },
        'method': { 'dataType': 'object' }
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'order',
            relatedModel: 'core.models.Order',
            includeInJSON: false
        }
    ],

    isPaypal: function(){
        return this.get('method').name == "paypal";
    },

    toJSON: function(){
        return {
            method: this.get('method')
        }
    }
});
