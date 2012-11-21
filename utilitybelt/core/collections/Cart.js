/**
 * Collection of cart items that represents a shopping cart.
 * Add and remove methods understand an additional option: quantity.
 * This allows to update a cart item quantity. Those methods also synchronize
 * a global sum.
 *
 * @property {string} currency The name of the currency used by the cart
 * @property {string} currencySymbol The symbol of the currency used by the cart
 */
core.define('core.collections.Cart', {
    extend: 'core.Collection',
    model: core.models.CartItem,
    order: false,
    autosave: true,

    /**
     * Constructor method. Reads static properties for currency
     * and configures the new instance.
     */
    initialize: function() {
        this.sum = 0;

        // Not every single update for the cart should trigger a call to .save right away,
        // so debounce this method.
        this.save = _.debounce(_.bind(this.save, this), 1000);
    },

    /**
     * Helper function to wrap an item in a cart item.
     * @param {core.models.Item} product The Product to wrap and add to the cart
     * @param {int} quantity The quantity of the product to add
     * @return {core.models.CartItem} A CartItem instance holding the given quantity of the given product
     */
    pack: function(product, quantity) {
        return new core.models.CartItem(product, quantity);
    },

    /**
     * Helper function to update the number of product in a cart item and sync the total price.
     * The change event from the cart item is delayed until the cart sum is updated.
     * @param {core.models.CartItem} cartItem The CartItem to update
     * @param {int} quantity The new quantity of cart item product
     * @return {int} The difference between the previous and the new quantity
     */
    _updateCartItem: function(cartItem, quantity) {
        var oldPrice = cartItem.price();
        var delta = cartItem.update(cartItem.get('quantity') + quantity, {silent: true});
        this.sum += cartItem.price() - oldPrice;
        if (this.order) {
            this.order.setSubTotal(this.sum);
            if (this.autosave) {
                // Set order.idle flag to false right away since .save() is debounced.
                this.order.idle = false;
                this.save();
            }
        }
        this.trigger('change', cartItem);
        return delta;
    },

    /**
     * Overwrites the add method to add an item or update its quantity if already
     * present and sync the total price of the collection.
     *
     * @param {Object} models A model or an array of model to add to the collection
     * @param {Object} options The options
     *
     * @trigger item:add (CartItem, delta) when an item is added to the cart
     * @trigger quantity:increase (CartItem, delta) when an item has its quantity
     *  increased (i.e. The item was already in the cart)
     */
    add: function(models, options) {
        models = _.isArray(models) ? models : [models];
        var opts = _.extend({quantity: 1, silent: false}, options);
        if (opts.quantity < 0)
            throw 'illegal-quantity';
        for (var i=0, bound=models.length; i<bound; i++) {
            var model = models[i],
                cartItem = this.pack(model, 0),
                id = cartItem.id,
                existingCartItem = this.get(id),
                delta;
            if (existingCartItem) {
                delta = this._updateCartItem(existingCartItem, opts.quantity);
                if (!opts.silent) {
                    this.trigger('quantity:increase', existingCartItem, delta);
                }
            } else {
                core.collections.Cart.__super__.add.call(this, cartItem, _.extend({}, opts, {silent: true}));
                delta = this._updateCartItem(cartItem, opts.quantity);
                if (!opts.silent) {
                    this.trigger('item:add', cartItem, delta);
                }
            }
        }
    },

    /**
     * Overwrites the remove method to update the quantity of an item and sync the
     * total price of the collection.
     * If the quantity of an item reach 0, then it's completely removed from the cart.
     * Note that handling the remove event is not reliable as triggering event can be
     * silenced (hence the overwriting).
     *
     * @param {Object} models A model or an array of model to remove from the collection
     * @param {Object} options The options
     *
     * @trigger quantity:decrease (CartItem, delta) when an item has its quantity
     *  decreased
     * @trigger item:remove (CartItem, delta) when an item is completely removed from the
     *  cart (i.e. its quantity reaches 0)
     * @trigger empty when the last item is fully removed
     *  cart (i.e. its quantity reaches 0)
     */
    remove: function(models, options) {
        models = _.isArray(models) ? models : [models];
        var opts = _.extend({quantity: 1}, options);
        if (opts.quantity < 0)
            throw 'illegal-quantity';
        for (var i=0, bound=models.length; i<bound; i++) {
            var model = models[i],
                cartItem = this.pack(model, opts.quantity),
                id = cartItem.get('id'),
                existingCartItem = this.get(id);
            if (existingCartItem) {
                var delta;
                if (existingCartItem.get('quantity') === opts.quantity) {
                    delta = this._updateCartItem(existingCartItem, -opts.quantity);
                    core.collections.Cart.__super__.remove.call(this, existingCartItem, opts);
                    this.trigger('item:remove', existingCartItem, -delta);
                } else {
                    delta = this._updateCartItem(existingCartItem, -opts.quantity);
                    this.trigger('quantity:decrease', existingCartItem, -delta);
                }
            } else {
                throw 'unknown-item';
            }
        }
        if (!this.length) {
            this.trigger('reset');
        }
    },

    /**
     * Removes one or more items from the cart, regardless of their quantity.
     *
     * @param {Object} models A model or an array of model to remove from the collection
     * @param {Object} options The options
     *
     * @trigger item:remove (CartItem, delta)
     * @trigger empty when the last item is fully removed
     */
    erase: function(models, options) {
        models = _.isArray(models) ? models : [models];
        for (var i=0, bound=models.length; i<bound; i++) {
            var model = models[i],
                cartItem = this.pack(model, opts.quantity),
                id = cartItem.get('id'),
                existingCartItem = this.get(id);
            if (existingCartItem) {
                var delta = existingCartItem.get('quantity');
                core.collections.Cart.__super__.remove.call(this, existingCartItem, options);
                this.trigger('item:remove', existingCartItem, delta);
            } else {
                throw 'unknown-item';
            }
        }
        if (!this.length) {
            this.trigger('reset');
        }
    },

    /**
     * Sets the sum to 0 and resets the cart content.
     */
    reset: function() {
        this.sum = 0;
        var reset = core.collections.Cart.__super__.reset.call(this);
        if (this.order) {
            this.order.setSubTotal(this.sum);
            if (this.autosave) {
                this.save();
            }
        }
        return reset;
    },

    /**
     * Alias for Backbone.Collection.reset().
     */
    empty: function() {
        return this.reset();
    },

    /**
     * Helper method updating an item quantity to the given amount.
     * @param {string} id The id of the cart item to update
     * @param {int} quantity The new quantity for the targeted item
     */
    update: function(id, quantity) {
        existingCartItem = this.get(id);
        if (!existingCartItem) {
            throw 'unknown-item';
        }
        var delta = quantity - existingCartItem.get('quantity');
        if (delta > 0) {
            return this.add(existingCartItem.get('item'), {quantity: delta});
        } else {
            return this.remove(existingCartItem.get('item'), {quantity: -delta});
        }
    },

    /**
     * Wraps order.save to allow the collection to trigger the sync event.
     *
     * @trigger sync
     */
    save: function(options) {
        options || (options = {});
        var success = options.success;
        var me = this;
        this.order.fromCart(this);
        this.order.save(null, {
            success: function(order, response) {
                me.trigger('sync');
                if (success)
                    success(order, response);
            }
        });
    },

    /**
     * Wraps order.search to allow feeding the collection when retrieving the order.
     *
     * @param {Object} options The options passed to the order search method
     * @return {jqXHR} The search request xhr object
     */
    fetch: function(options) {
        var me = this;
        this.autosave = false;
        options.success = _.wrap(options.success, function(handler, success, response) {
            if (handler)
                handler(me.order, success, response);
            me.order.toCart(me);
            me.autosave = true;
        });
        return this.order.search(options);
    },

    isReadyForSync: function() {
        return this.order && this.order.isReadyForSync() && this.length > 0;
    },

    hasFee: function() {
        return this.order && this.order.hasFee();
    }
});
