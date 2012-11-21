/**
 * Flavor Model, represents a flavor related to its sub item.
 */
core.define('core.models.Flavor', {

    extend: 'core.ItemFlavor',

    idAttribute: false,

    fields: {
        'id': {
            'dataType': 'string'
        },
        'structure': {
            'dataType': 'string'
        }
    },

    relations: [{
        type: Backbone.HasMany,
        collectionType: core.Collections,
        key: 'items',
        relatedModel: 'core.models.Item'
    }],

    initialize: function() {
        core.models.Item.__super__.initialize.call(this);
    },

    /**
     * Computes the price the flavor (i.e. sums the price of all its sub-items).
     * @return {number} The total amount of sub-items prices.
     */
    price: function() {
        var subitems = this.get('items'), price = 0;
        for(var i = 0, bound = subitems.length; i < bound; i++) {
            price += subitems.at(i).price();
        }
        return price;
    },

    attrPath: function(attr, sep, allNodes, withSize, withFlavor) {
        var path = [];
        if (withFlavor && this.has(attr)) {
            path.push(this.get(attr));
        }
        _.each(this.get('items').sortBy(function(item) { return item.get('id'); }), function(item) {
            path.push(item.attrPath(attr, sep, allNodes, withSize, withFlavor));
        });
        return path.join(sep);
    },

    toJSON: function() {
        var items = this.get('items');
        return _.extend({id: this.get('id')}, {
            items: items.length ? items.toJSON() : {}
        });
    }
});
