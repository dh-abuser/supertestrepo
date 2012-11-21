/**
 * Restaurant menu page.
 *
 * @handle authorize:grant Resaves the order for the logged in user and
 *  reloads the page with the new order id
 */
core.define('app.Menu', {
    extend: 'app.Page',
    events: {
        "click .menu-cart div.allround.cursor": 'showFlavorsOrAddToCart',
        'click .rating': 'showReviewsTab'
    },
    plugins: {
        '.tabs': 'tabs',
        '.vertical-tabs': [ 'vtabs', {
            selectClass: 'select',
            panelSelector: '.vertical-tabs-panels > div'
        } ]
    },

    initialize: function() {
        app.Menu.__super__.initialize.call(this);
        var menu = this,
            restaurant = this.options.restaurant,
            cartCollection = new core.collections.Cart();
        // init the order

        var active_address = this.options.active_address;
        if (active_address) {
            var activeAddressModel = new core.models.Address(active_address); //add necessary fields to save active address through the API
        }

        var deliveryAddress = new core.models.DeliveryAddress({
            user_id: this.options.user_id,
            address: activeAddressModel
        });

        var order = new core.models.Order({
            general: new core.models.OrderGeneral({restaurant_id: restaurant.id, user_id: this.options.user_id}),
            delivery_address: deliveryAddress
        });
        this.order = order;

        this.order.setRestaurant(new core.models.Restaurant({
            id: restaurant.id,
            delivery_fees: restaurant.delivery_fees,
            min_order_value: restaurant.min_order_value
        }));

        var allItems = [];
        _.each(lh_data.restaurant.menu.sections, function(section){
            _.each(section.items, function(item){
                allItems.push(item);
            });
        });
        this.allItems = allItems;

        var cartView;
        cartCollection.order = menu.order;

        this.cart = {
            collection: cartCollection,
            view: cartView
        };
        // build a set of available items
        this.items = {};
        _.each(restaurant.menu.sections, function(section) {
            _.each(section.items, function(item) {
                item.sectionId = section.id;
                menu.items[item.id] = item;
            });
        });

        this.options.user.on('authorize:grant', function(user, token) {
            var noReload = menu.order.ownedBy(user);
            menu.order.changeOwner(user, {
                success: function(order) {
                    order.idle = false;
                    if (noReload)
                        cartCollection.save();
                    else
                        window.location.reload();
                }
            });
        });
        this.options.user.on('authorize:anonym', function(user) {
            menu.order.changeOwner(user, {
                success: function(order) {
                    order.idle = false;
                    window.location.reload();
                }
            });
        });

        this.flb = new core.views.FlavorsLightbox();

        // link the order to the cart when loaded
        cartCollection.fetch({
            success: function(order, response) {
                order.resetCoupon(); //If coming back from the checkout page after entering a coupon, the order model contains the coupon information. At this stage the coupon must be null.

                cartView = new core.views.CartBox({
                    title: jsGetText('shopping_cart'),
                    el: '.shopping-cart',
                    paymentIcons: [
                        { css: 'cashPaymentIcons', tooltip: 'Barzahlung' },
                        { css: 'onlinePaymentIcons', tooltip: 'Onlinezahlung' }
                    ],
                    cart: {
                        checkout: function() {
                            window.location.href = core.utils.formatURL('/checkout/' + menu.order.id + '/');
                        },
                        preorder: !restaurant.general.open,
                        collection: cartCollection
                    },
                    fixable: {
                        marginTop: '10px',
                        hideEl: '.TestimonialRestaurant'
                    }
                });

                cartCollection.on('change reset', function() {
                    order.resetCoupon(); //never display coupon discounts in the cart on the menu page, no matter what the status of the order is on the server.
                });
            }
        });

        this.searchZip = new core.views.ZipCodeLightbox();
        this.searchZip.on("locationFound", function(event){
            menu.handleSearchFoundZipBox(event);
        });
        this.searchZip.on("locationNotFound", function(searchValue){
            core.utils.trackingLogger.logError('search_error_nomatch_menu', searchValue);
            menu.showError();
        });
        this.searchZip.on("location:fetchError", function(){
            menu.showError();
        });
        
        this.chooseBox = new core.views.ChooseLightbox();
        this.chooseBox.on("show:search", function(){
            $.cookie("active_address", "", {expires: -1});
            menu.chooseBox.hide();
            menu.searchZip.show(lh_data.restaurant.general.name);
        });

        this.checkShowZipSearch();
    },

    /**
    * Called when a user selects an item from the menu. If the item has flavors options, the flavors lightbox is displayed.
    * Otherwise, the item is added to the cart.
    * @param {Object} evt The event object
    */
    showFlavorsOrAddToCart: function(evt) {
        var $target = $(evt.currentTarget);
        var itemId = $target.find('a[data-item-id]').attr('data-item-id');

        var selectedItemObj = _.find(this.allItems, function(el){
            return el.id == itemId;
        });

        if(!selectedItemObj) {
            throw 'inexisting-item';
        }

        var selectedItem = new core.models.Item(selectedItemObj);
        this.flb.hide();
        this.flb = new core.views.FlavorsLightbox();
        
        if(selectedItem.getSubItems()) {
            this.flb.show(selectedItem);
            var me = this;
            this.flb.on("flavorsChosen", function(flavorsObj) {
                me.cart.collection.add(flavorsObj.selectedItemModel);
                me.checkShowZipSearch.call(me);
            });
        } else {
           this.cart.collection.add(selectedItem);
           this.checkShowZipSearch();
        }
    },
    
    checkShowZipSearch: function(){
        if ($.cookie("active_address") == null) {
            this.searchZip.show(lh_data.restaurant.general.name);
        }
    },
    
    handleSearchFoundZipBox: function(event){
        var me = this;
        this.searchZip.hide();
        if (event.collection) {
            if (event.collection.length > 1) {
                if (this.multiLocationLB && this.multiLocationLB.isShown()) {
                    return;
                }
                this.multiLocationLB = new core.views.MultipleLocationLightbox({
                    locations : event.collection,
                    position : "absolute",
                    searchTerm: event.searchTerm
                });
                this.multiLocationLB.on('location:selected', function(location) {
                    me.multiLocationLB.hide();
                    me.doesRestaurantFit.call(me, location, lh_data.restaurant_id);
                });
                this.multiLocationLB.show();
            } else if (event.collection.length == 1) {
                me.doesRestaurantFit.call(me, event.collection.first(), lh_data.restaurant_id);
            }
        }
    },
            
    doesRestaurantFit: function(location, restaurantId){
        this.restaurantModel = new core.models.Restaurant();
        this.activeAddress = location;
        var addressModel = new core.models.Address(location.get('address'));
        this.restaurantModel.set("address", addressModel);        //TODO this is just for simulating the error code
        this.restaurantModel.set("id", restaurantId);
        var me = this;
        this.restaurantModel.fetch({
            success: function(){
                    me.gotResponse.apply(me, arguments);
                }
        });
    },
    
    gotResponse: function(model, response){
        var fees = model.get("delivery_fees");
        if (fees.length == 0) {
            core.utils.trackingLogger.logError("search_error_no_delivery_to", [this.restaurantModel.id, this.activeAddress.get('address').suburb, this.activeAddress.get('address').zipcode].join(','));
            this.chooseBox.setRestaurantId(this.restaurantModel.get("id"));
            this.chooseBox.setAddress(this.activeAddress);
            this.chooseBox.show(model.get("general").name);
            return;
        }
        //reload the current page with setting the cookie for the current address
        core.utils.redirectRestaurant(model.get("general").slug, this.activeAddress);
    },

    /**
     * shows the error in a lightbox when we have an issue finding a location
     */
    showError : function() {
        var me = this;
        var messageLightbox = new core.views.Lightbox({
            title : jsGetText("search_not_found_title"),
            content : jsGetText("search_not_found_message"),
            template : "Lightbox/small.html"
        });
        messageLightbox.on("hide", function(){
            me.searchZip.__disabled = false;
        });
        me.searchZip.__disabled = true;
        messageLightbox.show();
    },

    showReviewsTab: function() {
        this.$('.tabs').tabs('option', 'selected', 'reviews_tab');
    }

});
