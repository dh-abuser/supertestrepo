describe("View.Payment", function() {
    describe("Coupon validation", function() {
        beforeEach(function() {
            var me = this;

            this.order = new core.models.Order({
                general: new core.models.OrderGeneral({restaurant_id: '123', user_id: '1234'}),
                coupon: new core.models.Coupon({code: ""}),
                validity: {
                    coupon: true
                },
                price_details: {
                    coupon_fee: 0,
                    delivery_fee: 0,
                    difference: 0,
                    min_order_value: 0,
                    price: 100,
                    subtotal: 100
                }
            });
            $("body").append($("<div class='newpayment'/>").css("display", "none"));

            this.basePrice = 100;
            this.view = new core.views.Payment({
                el: '.newpayment',
                basePrice: this.basePrice,
                payment_methods: [{"id": "0", "name": "cash"}, {"id": "1", "name": "paypal"}],
                order: this.order
            });

            //state variables
            me.couponValidated = false;
            me.viewReady = false;
            me.orderLoaded = false; //refactorable

            this.view.on("render", function(herp, derp, jerp){
                this.$("li").eq(1).click(); //preselect a payment method (paypal)
                me.viewReady = true;
            });

            this.server = sinon.fakeServer.create();
            var fetchResponse = JSON.stringify({"pagination": {"total_items": 1, "limit": 10, "total_pages": 1, "page": 1, "offset": 0}, "data": [{"general": {"user_uri": "http://develop-api.lieferheld.de/users/46085571/", "user_id": "46085571", "coupon_fee": 0.0, "restaurant_uri": "http://develop-api.lieferheld.de/restaurants/129/", "min_order_fee": 0.0, "price": 0.0, "delivery_fee": 0.0, "restaurant_id": "129", "arriving_at": "", "created_at": "2012-06-13T16:06:24Z", "submitted_at": ""}, "uri": "http://develop-api.lieferheld.de/users/46085571/orders/7772430/", "id": "7772430"}]});
            this.server.respondWith("GET", /.*/, [200, {"Content-Type": "application/json"}, fetchResponse]);
            
            this.order.search({
                success: function(orderArg, response) {
                    me.orderLoaded = true;
                }
            });
            me.server.respond(); 
        });

        afterEach(function() {
            this.view.remove();
            this.view = null;
            $(".newpayment").remove();
            this.server.restore();
        });

        var testCases = [{
            res: {
                validity: {
                    coupon: true
                },
                order_price_details: {
                    subtotal: 1234,
                    coupon_fee: -10 //discount
                },
                coupon: {
                    code: "testCode"
                }
            },
            fieldClass: "valid"
        }, 
        {
            res: {
                validity: {
                    coupon: false
                }
            },
            fieldClass: "invalid"
        }];
        _.each(testCases, function(testCase){
            it("Typing a " + testCase.fieldClass+ " coupon code updates the UI correctly", function() {
                var me = this;
                waitsFor(function(){
                    return me.viewReady;
                }, "UI to be rendered", 2000);

                waitsFor(function(){
                    return me.orderLoaded;
                }, "order to be loaded", 2000);

                runs(function(){
                    var respJSON = JSON.stringify(testCase.res);
                    this.server.respondWith("PUT", me.order.url(), [200, {"Content-Type": "application/json"}, respJSON]);

                    var couponField = me.view.$el.find(".order_form_coupon_code");
                    couponField.val("testcoupon");

                    me.view.on("validateCoupon", function(couponValue){
                        me.order.save();
                    });

                    //simulate a keyup in the coupon field
                    var e = jQuery.Event("keypress");
                    e.keyCode = 80; // "P"
                    couponField.trigger(e);

                    setTimeout(function(){
                        me.server.respond();
                    },3500); //accounts for delayed save by QuietModel

                    me.view.on("couponValidated", function(){
                        me.couponValidated = true;
                    });
                });

                waitsFor(function(){
                    return me.couponValidated;
                }, 5000);

                runs(function(){
                    var couponField = me.view.$el.find(".order_form_coupon_code");
                    var expectedAmount;
                    expect(couponField.hasClass(testCase.fieldClass)).toBeTruthy();
                    if(testCase.res.validity.coupon){
                        expectedAmount = core.utils.formatPrice(testCase.res.order_price_details.subtotal + testCase.res.order_price_details.coupon_fee);
                    }else{
                        expectedAmount = core.utils.formatPrice(me.basePrice);
                    }
                    expect(_.str.trim(me.view.$el.find(".payment_total").text())).toEqual(expectedAmount);
                });


            });
        });
    });
});
