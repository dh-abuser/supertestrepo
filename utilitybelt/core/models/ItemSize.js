/**
 * Item Model, represents a menu item, related to its flavors and sizes
 */
core.define('core.models.ItemSize', {

    extend: 'core.Model',

    idAttribute: false,

    fields: {
        'name': { 'dataType': 'string' },
        'description': { 'dataType': 'string', 'default': '' },
        'price': { 'dataType': 'number' }
    },

    validations: [
    ],

    initialize: function() {
    },

    attrPath: function(attr, sep, allNodes, withSize, withFlavor) {
        return withSize ? this.get('name') : false;
    },

    /**
     * Gets the price of the item size.
     * If no price is available, the return value is 0.
     * @return {number} The price of the item size (defaults to 0)
     */
    price: function() {
        return this.get('price') || 0;
    },

    /**
     * Returns a lightweight dumb object representing the instance.
     * Explictely ignore any ID as this model doesn't have one.
     * @return {Object} A lightweight and dumb representation of the instance
     */
    toJSON: function() {
        return { name: this.get('name'), price: this.get('price') };
    }
});
