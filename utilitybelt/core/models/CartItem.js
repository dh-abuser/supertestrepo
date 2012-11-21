/**
 * CartItem Model, represents a specific menu item choice, with the chosen flavor and size.
 * It's a front-end model only, used to hold and display cart info.
 */
core.define('core.models.CartItem', {
    extend: 'core.Model',

    initialize: function(item, quantity) {
        this.set('id', item.fullID());
        this.set('item', item);
        this.set('itemPrice', item.price());
        this.set('itemName', item.displayName());
        this.set('quantity', quantity);
        this.set('section', item.get('sectionId'));
    },

    comparator: function(item) {
        return item.id;
    },

    /**
     * Updates the number of products associated to the cart item.
     * Triggers a change event if the amount is updated (i.e. it's not the same as before).
     * Doesn't use the previous() method as the set() call is silent.
     * @see http://documentcloud.github.com/backbone/#Model-previous
     * @param {int} amount The new number of product
     */
    update: function(amount, options) {
        if (amount !== this.get('quantity')) {
            opts = _.extend({silent: false}, options);
            var q = this.get('quantity');
            this.set({ quantity: amount }, { silent: true });
            if (!opts.silent)
                this.trigger('change');
            return amount - q;
        }
        return 0;
    },

    /**
     * Computes the price of the cart item (i.e. product price * quantity).
     * @return {number} The total price of the cart item
     */
    price: function() {
        return this.get('quantity') * this.get('itemPrice');
    },

    toJSON: function() {
        return _.extend(
            {price: this.price()},
            this.attributes,
            {item: this.get('item').toJSON()}
        );
    }
});
