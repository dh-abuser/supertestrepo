/**
 * View for displaying a cart
 *
 * Example:
 *
 *     var cart = new core.views.Cart();
 *     cart.renderTo($('#some_element'));
 *
 * @param {Cart} cart The linked Cart item
 */
core.define('core.views.Cart', {
    extend: 'core.View',
    className: 'Cart',
    events: {},
    options: {
        readOnly: false,
        preorder: false,
        collection: false,
        mainTpl: 'Cart/Cart.html',
        itemTpl: 'Cart/Item.html',
        detailsTpl: 'Cart/Details.html'
    },

    /**
     * Constructor, sets collection and templates.
     * Builds partials to provide shortcuts for modifying item quantities.
     */
    initialize: function() {
        // partials for incrementing and decrementing quantities
        this.quantityInc = _.bind(this.quantityUpdate, this, 1);
        this.quantityDec = _.bind(this.quantityUpdate, this, -1);
        this.collection = this.options.collection || new core.collections.Cart();
        var me = this;
        // copied from parent class to avoid unbinding relevant events
        this.collection.on('reset change', function() {
            me.render();
        }, this.collection);
        // let's bind and trigger stuff when template is finally loaded
        core.utils.getTemplate([me.options.mainTpl, me.options.itemTpl, me.options.detailsTpl], function(main, item, details) {
            me.mainRender = _.template(main);
            me.itemRender = _.template(item);
            me.detailsRender = _.template(details);
            me.collection.on('change sync reset', _.bind(me.onItemsChange, me));
            me.collection.order.on('order:changeAddress', _.bind(me.onItemsChange, me));
            // (re)render item row for each addition or quantity modification
            me.collection.on('quantity:increase quantity:decrease item:add', function(item, delta) {
                me.unRenderItem('.empty');
                me._renderDetails();
                me.renderItem(item.toJSON());
            });
            // remove cart row for item removals
            me.collection.on('item:remove', function(item, delta) {
                if (this.length) {
                    me.unRenderItem(item.get('id'));
                    me._renderDetails();
                }
            });
            // display empty cart if emptied
            me.collection.on('reset', function() { me.renderEmpty(); });
            if (!me.options.readOnly) {
                _.extend(me.events, {
                    'click .cart-plus': 'quantityInc',
                    'click .cart-minus': 'quantityDec',
                    'click a.checkout': '_checkout'
                });
            }
            // trigger change and rendering
            me.collection.trigger('change');
        });
    },

    /**
     * Runs when cart items change (add, remove, empty, save state)
     */
    onItemsChange: function() {
        this.collection.order.get('price_details').updatePriceDetails();
        this.render();
        this.toggleCheckoutButton(this.collection.isReadyForSync());
    },

    /**
     * Toggles checkout button state.
     * @param {Boolean} enabled Boolean tellin wether the button must be enabled or not
     */
    toggleCheckoutButton: function(enabled) {
        var btn = this.$('.checkout'), cls = 'disabled';
        if (enabled)
            btn.removeClass(cls);
        else
            btn.addClass(cls);
    },

    /**
     * Renders widget using the collection and the templates
     * @return {core.views.Cart} this
     */
    render: function() {
        var me = this,
            collection = me.collection;
        var records = collection.toJSON();
        me.$el.empty().append(me.mainRender({cart: this.options}));
        if (collection.length) {
            this._renderDetails();
            _.each(records, function(item) {
                me.renderItem(item);
            });
        } else {
            me.renderEmpty();
        }
        return core.views.Cart.__super__.render.call(this);
    },

    /**
     * Refreshes or adds a new item to the cart.
     * @param {Object} item A hash (produced by CartItem.toJSON())
     * @return {core.views.Cart} this
     */
    renderItem: function(item) {
        item.price = core.utils.formatPrice(item.price);
        var markup = this.itemRender({
            cartItem: item,
            cart: {
                readOnly: this.options.readOnly
            }
        });
        var current = this.$('.' + item.id);
        if (current.length) {
            current.replaceWith($(markup));
        } else {
            this.$('ul .meta:first').before(markup);
        }
        return this;
    },

    /**
     * Refreshes or adds a detail rows to the cart.
     * @return {core.views.Cart} this
     */
    _renderDetails: function() {
        var priceDetails = this.collection.order.get('price_details').viewJSON();
        var markup = this.detailsRender(priceDetails);
        this.$('ul .meta').remove();
        this.$('ul').append(markup);
        return this;
    },

    unRenderItem: function(id) {
        this.$('ul li.' + id).remove();
        if (!this.collection.length) {
            this.renderEmpty();
        }
    },

    /**
     * Runs when cart is empty.
     * Note that fees should still be displayed:
     */
    renderEmpty: function() {
        var cartItems = this.$('ul').empty();
        $('<li>').addClass('empty span-12').text(jsGetText("cart_empty")).prependTo(cartItems);
        if (this.collection.hasFee()) {
            this._renderDetails();
        }
    },

    /**
     * Cart item spinner controls handler.
     * Its only business is to identify the modified element
     * and ask the collection to update accordingly.
     * Everything else is done by the handlers bound to the collection.
     * @param {int} inc The increment (positive or negative) to add to the current quantity
     * @param {Object} e A jQuery event with a current target having a "name" attribute
     */
    quantityUpdate: function(inc, e) {
        var input = $(e.currentTarget).parents('li').children(':input'),
            itemId = input.attr('name').split('|').pop(),
            q = parseInt(input.val()) + inc;
        input.val(q);
        this.collection.update(itemId, q);
    },

    _checkout: function(e) {
        if (this.options.checkout && this.collection.isReadyForSync()) {
            var me = this;
            me.toggleCheckoutButton(false); // disable button to prevent double submit
            this.collection.save({
                success: function() {
                    me.toggleCheckoutButton(false); // disable button to prevent double submit
                    me.undelegateEvents(); // so cart content can't be changed
                    me.options.checkout();
                }
            });
        }
    },

    /**
     * This demo code uses some fixtures to render a cart containing some
     * items.
     * @return {core.views.Cart} The view used to render a cart
     */
    demo: function() {
        var items = [
            {
                "description": "inkl. 0,15\u20ac Pfand",
                "sizes": [{"price": 5, "name": "L"}],
                "pic": "",
                "main_item": true,
                "sub_item": false,
                "id": "mp1",
                "name": "Fanta*1,3,5,7 0,5L  "
            }, {
                "description": "inkl. 0,15\u20ac Pfand",
                "sizes": [{"price": 20, "name": "XL"}],
                "pic": "",
                "main_item": true,
                "sub_item": false,
                "id": "mp2",
                "name": "Pain saucisse"
            }
        ];
        var cart = new core.collections.Cart();
        for (var i=0, bound=items.length; i<bound; i++) {
            var p = new core.models.Item(items[i]);
            cart.add(p, {quantity: 2*i+1});
        }
        var view = new core.views.Cart({collection: cart});
        return view;
    }
});
