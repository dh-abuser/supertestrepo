/**
 * core.models.CartItem tests
 */
describe("core.models.CartItem", function() {
    it('Uses the item full name as ID ', function() {
        var item = _.clone(tests.collections.Item.records.main[1]);
        item.flavors = tests.models.Item.records.flavors[0];
        item = new core.models.Item(item);
        var record = new core.models.CartItem(item, 1);
        expect(record.get('id')).toEqual(record.get('item').fullID());
    });

    describe('Quantity updating', function() {
        beforeEach(function() {
            var item = _.clone(tests.collections.Item.records.main[1]);
            item.flavors = tests.models.Item.records.flavors[0];
            item = new core.models.Item(item);
            this.record = new core.models.CartItem(item, 1);
        });

        it('Instantiated with the right quantity', function() {
            expect(this.record.get('quantity')).toEqual(1);
        });

        it('Returns the difference between old and new quantity', function() {
            var delta = this.record.update(5);
            expect(this.record.get('quantity')).toEqual(5);
            expect(delta).toEqual(5-1);
        });

        it('Triggers a change event with a different amount', function() {
            var spy = sinon.spy();
            this.record.bind('change', spy);
            this.record.update(5);
            expect(this.record.get('quantity')).toEqual(5);
            expect(spy.called).toBeTruthy();
        });

        it('Does not trigger a change event with a identical amount', function() {
            var spy = sinon.spy();
            this.record.bind('change', spy);
            this.record.update(1);
            expect(this.record.get('quantity')).toEqual(1);
            expect(spy.called).toBeFalsy();
        });
    });

    describe('Price computing', function() {
        beforeEach(function() {
            var item = _.clone(tests.collections.Item.records.main[1]);
            item = new core.models.Item(item);
            this.record = new core.models.CartItem(item, 1);
        });

        it('Initial price is correct', function() {
            expect(this.record.price()).toBeCloseTo(20, 2);
        });

        it('Price is correct after update', function() {
            var delta = this.record.update(5);
            expect(this.record.price()).toBeCloseTo(20*5, 2);
        });
    });
});
