/**
 *  Order model tests
 */
describe("core.models.Order", function() {    
  beforeEach(function() {
        this.order = new core.models.Order({
            general: new core.models.OrderGeneral({restaurant_id: '123', user_id: '1234'}),
            coupon: new core.models.Coupon({code: ""}),
            validity: {
                coupon: true
            },
            price_details:{
                coupon_fee: 0,
                delivery_fee: 0,
                difference: 0,
                min_order_value: 0,
                price: 100,
                subtotal: 100
            }
        });
       this.record = new core.models.Address();
    });
    
    it("Correctly computes price details", function() {
        var price_details = this.order.get('price_details');
        expect(price_details).toBeDefined();
        expect(price_details.get('total_price')).toBeDefined();
        expect(price_details.get('total_price')).toEqual(100);

        price_details.set('delivery_fee', 20);
        expect(price_details.get('price')).toEqual(120);

        price_details.set('coupon_fee', -5);
        expect(price_details.get('price')).toEqual(115);

        price_details.set('min_order_value', 150);
        expect(price_details.get('difference')).toEqual(50);
        expect(price_details.get('price')).toEqual(115);
        expect(price_details.get('total_price')).toEqual(150 + 20 - 5);

        price_details.set('min_order_value', 50);
        expect(price_details.get('difference')).toEqual(0);
        expect(price_details.get('price')).toEqual(115);
        expect(price_details.get('total_price')).toEqual(115);
    });
});