describe("core.collections.Cart", function() {
    describe("Shopping", function() {
        beforeEach(function() {
            this.data = {
                products: _.clone(tests.collections.Item.records.main),
                // subproducts: _.clone(tests.collections.Item.records.sub),
                flavors: _.clone(tests.models.Item.records.flavors)
            };
        });

        describe("Fill the cart", function() {
            beforeEach(function() {
                this.cart = new core.collections.Cart();
            });

            it("Items can be added", function() {
                var p1 = new core.models.Item(this.data.products[0]);
                var p2 = new core.models.Item(this.data.products[1]);
                p2.set('flavors', new core.models.Flavor(this.data.flavors[0]));
                this.cart.add(p1);
                expect(this.cart.sum).toBeCloseTo(5);
                expect(this.cart.length).toEqual(1);
                this.cart.add(p2);
                expect(this.cart.sum).toBeCloseTo(25.3);
                expect(this.cart.length).toEqual(2);
                this.cart.add(p2);
                expect(this.cart.sum).toBeCloseTo(45.6);
                expect(this.cart.length).toEqual(2);
            });

            it("Items with different flavors are separated", function() {
                // make 2 different cart items from the same product
                var p1 = new core.models.Item(this.data.products[0]);
                var p2 = new core.models.Item(this.data.products[0]);
                p2.set('flavors', new core.models.Flavor(this.data.flavors[0]));
                this.cart.add(p1);
                expect(this.cart.length).toEqual(1);
                this.cart.add(p2);
                expect(this.cart.length).toEqual(2);
                // add a 3rd cart item based on the same product
                var p3 = new core.models.Item(this.data.products[0]);
                var p3Flavor = this.data.flavors[0];
                p3Flavor.items.pop();
                p3.set('flavors', new core.models.Flavor(p3Flavor));
                this.cart.add(p3);
                expect(this.cart.length).toEqual(3);
            });

            it("Adding product triggers the right event", function() {
                var cart = this.cart,
                    p1 = new core.models.Item(this.data.products[0]);

                var spyAdd = sinon.spy();
                cart.bind('item:add', spyAdd);
                var spyIncrease = sinon.spy();
                cart.bind('quantity:increase', spyIncrease);
                cart.add(p1);
                expect(spyAdd.called).toBeTruthy();
                expect(spyIncrease.called).toBeFalsy();

                var spyArgs = spyAdd.args.shift();
                expect(spyArgs[0].self).toEqual('core.models.CartItem');
                expect(spyArgs[0].id).toEqual(p1.fullID());
                expect(spyArgs[1]).toEqual(1);
            });

            it("Increasing product quantity triggers the right event", function() {
                var cart = this.cart,
                    p1 = new core.models.Item(this.data.products[0]);
                cart.add(p1);

                var spyAdd = sinon.spy();
                cart.bind('item:add', spyAdd);
                var spyIncrease = sinon.spy();
                cart.bind('quantity:increase', spyIncrease);
                cart.add(p1);
                expect(spyAdd.called).toBeFalsy();
                expect(spyIncrease.called).toBeTruthy();

                var spyArgs = spyIncrease.args.shift();
                expect(spyArgs[0].self).toEqual('core.models.CartItem');
                expect(spyArgs[0].id).toEqual(p1.fullID());
                expect(spyArgs[1]).toEqual(1);
            });

            it("Adding product with negative quantity is forbidden", function() {
                var cart = this.cart,
                    p1 = new core.models.Item(this.data.products[0]);

                expect(function() { cart.add(p1, {quantity: -2}); }).toThrow('illegal-quantity');
            });
        });

        describe("Empty the cart", function() {
            beforeEach(function() {
                this.cart = new core.collections.Cart();
                var p1 = new core.models.Item(this.data.products[0]);
                this.cart.add(p1, {quantity: 3});
                this.product = p1;
            });

            it("Items can be removed", function() {
                var cart = this.cart,
                    p1 = this.product,
                    p1FullName = p1.fullID();
                expect(cart.sum).toBeCloseTo(5*3);
                expect(cart.length).toEqual(1);
                cart.remove(p1);
                expect(cart.sum).toBeCloseTo(5*2);
                expect(cart.length).toEqual(1);
                cart.remove(p1, {quantity: 2});
                expect(cart.get(p1FullName)).toBeFalsy();
                expect(function() { cart.remove(p1); }).toThrow('unknown-item');
            });

            it("Decreasing product quantity triggers the right event", function() {
                var cart = this.cart;
                var spyDecrease = sinon.spy();
                cart.bind('quantity:decrease', spyDecrease);
                var spyRemove = sinon.spy();
                cart.bind('item:remove', spyRemove);
                cart.remove(this.product);
                expect(spyRemove.called).toBeFalsy();
                expect(spyDecrease.called).toBeTruthy();

                var spyArgs = spyDecrease.args.shift();
                expect(spyArgs[0].self).toEqual('core.models.CartItem');
                expect(spyArgs[0].id).toEqual(this.product.fullID());
                expect(spyArgs[1]).toEqual(1);
            });

            it("Removing product triggers the right event", function() {
                var cart = this.cart;
                var spyDecrease = sinon.spy();
                cart.bind('quantity:decrease', spyDecrease);
                var spyRemove = sinon.spy();
                cart.bind('item:remove', spyRemove);
                cart.remove(this.product, {quantity: 3});
                expect(spyRemove.called).toBeTruthy();
                expect(spyDecrease.called).toBeFalsy();

                var spyArgs = spyRemove.args.shift();
                expect(spyArgs[0].self).toEqual('core.models.CartItem');
                expect(spyArgs[0].id).toEqual(this.product.fullID());
                expect(spyArgs[1]).toEqual(3);
            });

            it("Removing product with negative quantity is forbidden", function() {
                var cart = this.cart,
                    p1 = this.product;

                expect(function() { cart.remove(p1, {quantity: -2}); }).toThrow('illegal-quantity');
            });

            it("Remove a product no matter what's its quantity", function() {
                var cart = this.cart,
                    p1 = this.product;
                var spyDecrease = sinon.spy();
                cart.bind('quantity:decrease', spyDecrease);
                var spyRemove = sinon.spy();
                cart.bind('item:remove', spyRemove);
                cart.erase(this.product);
                expect(spyRemove.called).toBeTruthy();
                expect(spyDecrease.called).toBeFalsy();

                var spyArgs = spyRemove.args.shift();
                expect(spyArgs[0].self).toEqual('core.models.CartItem');
                expect(spyArgs[0].id).toEqual(p1.fullID());
                expect(spyArgs[1]).toEqual(3);

                expect(function() { cart.remove(p1); }).toThrow('unknown-item');
            });

            it("Empty removes all at once", function() {
                var cart = this.cart,
                    p1 = this.product;
                cart.empty();
                expect(cart.sum).toEqual(0);
                expect(cart.length).toEqual(0);
            });

            it("Emptying an empty cart has no effect", function() {
                var cart = new core.collections.Cart();
                cart.empty();
                expect(cart.sum).toEqual(0);
                expect(cart.length).toEqual(0);
            });
        });

        describe("Updating cart items by id", function() {
            beforeEach(function() {
                this.cart = new core.collections.Cart();
                var p1 = new core.models.Item(this.data.products[0]);
                this.cart.add(p1, {quantity: 3});
                this.product = p1;
                spyOn(this.cart, 'add');
                spyOn(this.cart, 'remove');
            });

            it("Updating to an unknown item throws an exception", function() {
                var cart = this.cart,
                    p1FullName =this.product.fullID();
                expect(function() { cart.update('Inexisting item ID', 5); }).toThrow('unknown-item');
                expect(cart.add).not.toHaveBeenCalled();
                expect(cart.remove).not.toHaveBeenCalled();
            });

            it("Updating to a greater quantity calls add()", function() {
                var cart = this.cart,
                    p1FullName =this.product.fullID();
                cart.update(p1FullName, 5);
                expect(cart.add).toHaveBeenCalled();
                expect(cart.remove).not.toHaveBeenCalled();
            });

            it("Updating to a lower quantity calls remove()", function() {
                var cart = this.cart,
                    p1FullName =this.product.fullID();
                cart.update(p1FullName, 1);
                expect(cart.add).not.toHaveBeenCalled();
                expect(cart.remove).toHaveBeenCalled();
            });
        });
    });
});
