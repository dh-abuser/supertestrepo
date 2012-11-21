/**
 * Shopping Cart container, for inline display.
 */
core.define('core.views.CartBox', {
    extend: 'core.views.Box',
    className: "CartBox",

    initialize: function() {
        core.views.CartBox.__super__.initialize.call(this);
        var me = this;
        this.on('render', function() {
            me.addClearAllButton();
            me.addPaymentIcons(this.options.paymentIcons);
            me.addItem(core.views.Cart, this.options.cart || {});
        });
    },

    /*
     * Adds 'clear cart' button
     * @returns jQuery
     */
    addClearAllButton: function(el) {
        var html = '<div tooltip="' + jsGetText('clear_cart') + '" class="span-2 cart-delete"></div>';
        var $btn = $(html);
        var $title = $('.top-box', this.$el);
        $btn.on('click', _.bind(this.onClearBtnClick, this));
        return $btn.appendTo($title);
    },

    /*
     * Adds payment icons
     */
    addPaymentIcons: function(icons) {
        var $footer = this.$('section > div:last');
        _.each(icons, function(icon) {
            $('<div>').addClass(icon.css).attr('tooltip', icon.tooltip).appendTo($footer);
        });
    },

    /*
     * Handler for the 'clear cart' button
     */
    onClearBtnClick: function() {
        this.getItem().collection.empty();
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
            cart: {collection: cart}
        });
        return bb;
    }
});
