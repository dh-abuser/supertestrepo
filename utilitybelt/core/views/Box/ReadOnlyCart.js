/**
 * Shopping Cart container (read only mode), for inline display.
 */
core.define('core.views.ReadOnlyCartBox', {
    extend: 'core.views.CartBox',

    initialize: function() {
        core.views.CartBox.__super__.initialize.call(this);
        var me = this;
        this.on('render', function() {
            me.setTitle();
            me.removeFooter();
            if (me.options.editLink) {
                me.addEditLink(me.options.editLink);
            }
            me.addItem(core.views.Cart, this.options.cart || {});
        });
    },

    setTitle: function() {
        this.$('.top-box h3').text(jsGetText('read_only_cart_title'));
    },

    /*
     * Adds edit link
     */
    addEditLink: function(link) {
        this.$('.top-box').append(this.make('a', {
            'href': link,
            'class': 'edit-icon'
        }));
    },

    removeFooter: function() {
        this.$('.cartIcon-conatiner').remove();
    },

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

        var bb = new core.views.CartBox({
            title: jsGetText('shopping_cart'),
            paymentIcons: [
                { css: 'cashPaymentIcons', tooltip: 'Barzahlung' },
                { css: 'onlinePaymentIcons', tooltip: 'Onlinezahlung' }
            ],
            cart: {collection: cart, readOnly: true}
        });
        return bb;
    }
});
