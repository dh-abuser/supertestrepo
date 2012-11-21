/**
 * Order checkout page.
 *
 * @handle authorize:grant Resaves the order for the logged in user and
 *  reloads the page with the new order id
 */
core.define('app.Checkout', {
    extend: 'app.Page',
    plugins: {
        'form': 'jqTransform'
    },
    saveActiveAddress: function(order, activeAddress) {
        var deliveryAddress = order.get('delivery_address').get('address');
        var fullAddress = {
                name: deliveryAddress.get('name'),
                lastname: deliveryAddress.get('lastname'),
                state: deliveryAddress.get('state'),
                suburb: deliveryAddress.get('suburb'),
                zipcode: deliveryAddress.get('zipcode'),
                street_number: deliveryAddress.get('street_number'),
                street_name: deliveryAddress.get('street_name'),
                door: deliveryAddress.get('unit_number'),
                phone: deliveryAddress.get('phone')
        }
        var address = $.extend({}, activeAddress, fullAddress);
        core.runtime.persist('active_address', address, true);
    },

    options : {
        throbberDelay: 1
    },

    initialize: function() {
        var page = this,
            restaurant = this.options.restaurant,
            user = this.options.user,
            cartCollection = new core.collections.Cart(),
            orderBootstrap = lh_order_data,
            restaurantUrl = this.options.restaurant_url;

        // init the order
        var order = new core.models.Order(orderBootstrap);
        order.resetCoupon(); //upon page refresh, the payment widget view is rendered preemptively by the CMS. Do not use coupon state information from the API and force an empty coupon.
        order.setRestaurant(new core.models.Restaurant({
            id: restaurant.id,
            delivery_fees: restaurant.delivery_fees,
            min_order_value: restaurant.min_order_value
        }));

        var activeAddress = core.runtime.fetch('active_address', true);
        page.options.el = 'form.orderform';
        page.options.activeAddress = activeAddress;
        page.form = new core.views.CheckoutForm(page.options);
        page.form.disableSubmit();

        if (this.options.user.isAuthorized()) {
            if (activeAddress) {
                page.form.prefillFromActiveAddress();
            }
            order.on('finalized', _.bind(this.saveActiveAddress, this, order, activeAddress));
        }

        var cartView;
        cartCollection.order = order;

        var paymentView = new core.views.Payment({
            el: '.newpayment',
            basePrice: order.get('price_details').get('price'),
            payment_methods: lh_data.restaurant.payment_methods,
            order: order
        });
        paymentView.on('validateCoupon', _.bind(page.form.updateOrder, page.form));

        // replace the authorize handler to transfer the order
        user.on('authorize:grant', function(user, token) {
            var noReload = order.ownedBy(user);
            order.changeOwner(user, {success: function(order) {
                if (noReload) {
                    cartCollection.save();
                }
                else {
                    window.location.href = core.utils.formatURL('/checkout/' + order.id);
                }
            }});
        });
        user.on('authorize:anonym', function(user) {
            // unbind this handler to avoid retriggering if a parallel query fails.
            user.off('authorize:anonym');
            order.changeOwner(user, {success: function(order) {
                window.location.href = core.utils.formatURL('/checkout/' + order.id);
            }});
        });

        order.setUser(this.options.user);
        cartCollection.fetch({
            success: function(order, response) {
                order.resetCoupon(); //after fetching the model, the payment view is rendered by the widget. Must reset the coupon state once again.
                cartView = new core.views.ReadOnlyCartBox({
                    title: jsGetText('shopping_cart'),
                    el: 'section.default-box',
                    editLink: core.utils.formatURL(restaurantUrl),
                    cart: {
                        readOnly: true,
                        collection: cartCollection
                    },
                    fixable: {
                        marginTop: '10px',
                        hideEl: '.TestimonialRestaurant'
                    }
                });
                // Select Order Time: Now as default
                if (page.form.setOrder(order)) {
                    page.form.$('input[name=delivery_time][value=now]').trigger('click');
                    page.form.enableSubmit();
                }
                order.on("change:price_details", function(){
                    cartView.render();
                });
            }
        });

        app.Checkout.__super__.initialize.call(this);
    }
});
