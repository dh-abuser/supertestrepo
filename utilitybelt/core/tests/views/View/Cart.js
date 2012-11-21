describe("View.Cart", function() {

    beforeEach(function() {
        this.mockEvent = {
            currentTarget: $('<li><input name="mp1-L" value="1"><a></a></li>').find('a')
        };
        this.order = {"status": "created", "delivery_address": {"uri": "", "id": "", "address": {}}, "delivery_time": "", "coupon": {"code": ""}, "uri": "http://staging-api.deliveryhero.com.au:7001/users/3724003/orders/249044/", "user_location": {"latitude": 0.0, "longitude": 0.0}, "number": "", "validity": {"delivery_address": false, "errors": {"delivery_address": [1], "delivery_time": [2]}, "delivery_time": false, "coupon": true, "items": true, "payment_method": true}, "general": {"user_uri": "http://staging-api.deliveryhero.com.au:7001/users/3724003/", "user_id": "3724003", "coupon_fee": 0.0, "restaurant_uri": "http://staging-api.deliveryhero.com.au:7001/restaurants/30/", "min_order_fee": 0.0, "price": 0.0, "delivery_fee": 0.0, "restaurant_id": "30", "arriving_at": "", "created_at": "2012-07-04T17:11:36Z", "submitted_at": ""}, "estimated_minutes": "", "order_price_details": {"coupon_fee": 0.0, "price": 30.0, "delivery_fee": 0.0, "min_order_value": 0.0, "difference": 0.0, "subtotal": 30.0}, "id": "249044", "sections": [{"items": [{"flavors": {"items": [{"flavors": {"items": [{"description": "", "main_item": false, "name": "Garlic Bread", "comments": "", "sub_item": true, "id": "68702", "size": {"price": 0.0, "name": "normal"}}], "id": "0"}, "id": "13540"}, {"flavors": {"items": [{"description": "", "main_item": false, "name": "Napoli ", "comments": "", "sub_item": true, "id": "64917", "size": {"price": 0.0, "name": "normal"}}, {"description": "", "main_item": false, "name": "Texas ", "comments": "", "sub_item": true, "id": "64920", "size": {"price": 0.0, "name": "normal"}}], "id": "0"}, "id": "12836"}, {"flavors": {"items": [{"description": " ", "main_item": false, "name": "Pepsi Max", "comments": "", "sub_item": true, "id": "64138", "size": {"price": 0.0, "name": "normal"}}], "id": "0"}, "id": "12661"}], "id": "0"}, "name": "Deal 1", "description": "2 Large Traditional Pizzas, 1 x 1.25L Drink, 1 Garlic Bread (normal price $43.50)", "main_item": true, "comments": "", "sub_item": false, "size": {"price": 30.0, "name": "normal"}, "id": "103426", "quantity": 1}], "id": "249044"}], "payment": {"method": {"id": "0", "name": "cash"}, "gateway": {}}};
    });

    describe("Event handling", function() {
        beforeEach(function() {
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
            this.items = [];
            var cart = new core.collections.Cart();
            cart.order = new core.models.Order(this.order);
            for (var i=0, bound=items.length; i<bound; i++) {
                var p = new core.models.Item(items[i]);
                this.items.push(p);
                cart.add(p, {quantity: 2*i+1});
            }
            this.view = new core.views.Cart({collection: cart});

            spyOn(this.view, 'renderItem');
            spyOn(this.view, '_renderDetails');
            spyOn(this.view, 'unRenderItem');
            spyOn(this.view, 'render');
            spyOn(this.view, 'renderEmpty');
        });

        afterEach(function() {
            this.view.remove();
            this.view = null;
        });

        it("Adding an item or changing a quantity refresh items and sum", function() {
            this.view.collection.add(this.items[0]);
            expect(this.view.renderItem).toHaveBeenCalled();
            expect(this.view._renderDetails).toHaveBeenCalled();
            expect(this.view.unRenderItem).toHaveBeenCalled();
            expect(this.view.renderEmpty).not.toHaveBeenCalled();
        });
        
        it("Erasing an item from the cart unrenders it", function() {
            this.view.collection.erase(this.items[0]);
            expect(this.view.unRenderItem).toHaveBeenCalled();
            expect(this.view._renderDetails).toHaveBeenCalled();
            expect(this.view.renderItem).not.toHaveBeenCalled();
            expect(this.view.render).not.toHaveBeenCalled();
            expect(this.view.renderEmpty).not.toHaveBeenCalled();
        });
        
        it("Emptying the cart removes all content", function() {
            this.view.collection.empty();
            expect(this.view.unRenderItem).not.toHaveBeenCalled();
            expect(this.view._renderDetails).not.toHaveBeenCalled();
            expect(this.view.renderItem).not.toHaveBeenCalled();
            expect(this.view.renderEmpty).toHaveBeenCalled();
        });
        
        it("Updating quantity (from UI) triggers collection update", function() {
            spyOn(this.view.collection, 'update');
            this.view.quantityUpdate(1, this.mockEvent);
            expect(this.view.collection.update).toHaveBeenCalled();
            expect(this.view.collection.update).toHaveBeenCalledWith('mp1-L', 2);
        });
    });
    
    describe("Read only mode", function() {
        beforeEach(function() {
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
            this.items = [];
            this.cart = new core.collections.Cart();
            this.cart.order = new core.models.Order(this.order);
            for (var i=0, bound=items.length; i<bound; i++) {
                var p = new core.models.Item(items[i]);
                this.items.push(p);
                this.cart.add(p, {quantity: 2*i+1});
            }
        });

        afterEach(function() {
            this.view.remove();
            this.view = null;
        });

        it("Cart event handlers are not triggerable", function() {
            this.view = new core.views.Cart({collection: this.cart, readOnly: true});
            spyOn(this.view, 'quantityInc');
            spyOn(this.view, 'quantityDec');

            this.view.$('.cart-minus').trigger('click');
            expect(this.view.quantityInc).not.toHaveBeenCalled();
            expect(this.view.quantityDec).not.toHaveBeenCalled();
            this.view.$('.cart-plus').trigger('click');
            expect(this.view.quantityInc).not.toHaveBeenCalled();
            expect(this.view.quantityDec).not.toHaveBeenCalled();
        });
    });
});
