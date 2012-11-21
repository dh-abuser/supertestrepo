/**
 * Restaurant Model, represents a restaurant.
 */
core.define('core.models.Restaurant', {
    extend: 'core.Model',
     relations: [{
        type: Backbone.HasMany,
        key: 'delivery_fees',
        relatedModel: 'core.Model',
        collectionType: 'core.collections.DeliveryFee'
	},
    {
        type: Backbone.HasOne,
        key: "address",
        relatedModel: "core.models.Address"
    }],

    initialize: function() {
        core.models.Restaurant.__super__.initialize.call(this);
    },

    /**
     * @see: http://mockapi.lieferheld.de/beta/doc/reference/restaurants/restaurants.html#restaurant-details for more details
     * 
     * FOR GERMAN API:
     * http://mockapi.lieferheld.de/v2/restaurants/r2/?lat=21.34589&lon=12.456677
     * 
     * FOR AUSTRALIAN API:
     * http://mockapi.lieferheld.de/v2/restaurants/r2/?state=[STATE]&city=[CITY]&zipcode=[ZIPCODE]&suburb=[SUBURB]
     */
    url: function() {
        var url = ['/api/restaurants/'];
        if (!this.isNew()) {
            url = url.concat([this.id, '/']);
        }
        var add = this.get("address");
        if (add != null){
            url = url.concat(["?state=",add.get("state"),"&city=",add.get("city"),"&zipcode=",add.get("zipcode"),"&suburb=",add.get("suburb")]);
        }
        return url.join('');
    },

    /**
     * Overwritten delivery_fee getter.
     * Returns the minimal delivery fee known for the restaurant, defaulting the value to 0.
     *
     * @return {number} The minimal delivery fee known for the restaurant
     */
    getDeliveryFee: function() {
        if (!this.has('delivery_fees')) {
            return 0;
        }
        return this.attributes['delivery_fees'].getSmallestAmount();
    },

    /**
     * Overwritten min_order_value getter.
     * Returns the min_order_value, defaulting the value to 0.
     *
     * @return {number} The minimum order value for the restaurant
     */
    getMinOrderValue: function() {
        return this.attributes['min_order_value'] || 0;
    }
});
