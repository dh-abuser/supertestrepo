/**
 * core.models.CartItem tests
 */
describe("core.models.Item", function() {
    describe('Generates a correct full name', function() {
        describe('With no flavors', function() {
            it('Builds a correct compound ID', function() {
                this.record = new core.models.Item(tests.collections.Item.records.main[0]);
                expect(this.record.fullID()).toEqual('mp1-L');
            });

            it('Builds another correct compound ID', function() {
                this.record = new core.models.Item(tests.collections.Item.records.main[1]);
                expect(this.record.fullID()).toEqual('mp2-XL');
            });

            it('Builds a correct compound ID without a size', function() {
                var record = _.clone(tests.collections.Item.records.main[1]);
                record.sizes = null;
                this.record = new core.models.Item(record);
                expect(this.record.fullID()).toEqual('mp2');
            });
        });

        describe('With flavors', function() {
            it('Builds a correct compound ID', function() {
                var record = _.clone(tests.collections.Item.records.main[1]);
                record.flavors = tests.models.Item.records.flavors[0];
                record = new core.models.Item(record);
                // API is broken and gives a wrong flavor ID.
                // TODO Revert code and test if the new test fails
                // expect(record.fullID()).toEqual('mp2-XL-f1-sp1-sosmall-sp2-sohuge');
                expect(record.fullID()).toEqual('mp2-XL-sp1-sosmall-sp2-sohuge');
            });
        });
    });

    describe('Generates a correct price', function() {
        describe('With no size', function() {
            it('Throw an exception', function() {
                var record = _.clone(tests.collections.Item.records.main[1]);
                record.sizes = null;
                record = new core.models.Item(record);
                expect(function() { record.price(); }).toThrow('no-size-available');
            });
        });

        describe('With no flavors', function() {
            it('Price only depends on the size', function() {
                var record = new core.models.Item(tests.collections.Item.records.main[0]);
                expect(record.price()).toBeCloseTo(5, 2);
                record = new core.models.Item(tests.collections.Item.records.main[1]);
                expect(record.price()).toBeCloseTo(20, 2);
            });
        });

        describe('With flavors', function() {
            it('Price should contain any sub item price', function() {
                var record = _.clone(tests.collections.Item.records.main[1]);
                record.flavors = tests.models.Item.records.flavors[0];
                record = new core.models.Item(record);
                expect(record.price()).toBeCloseTo(20.3, 2);
            });
        });
    });
    
    describe('Correctly handles flavors', function(){
        var item = new core.models.Item(tests.models.ItemWithNestedFlavors);

        it("Should find an item's sub-items", function(){
            var subItems = item.getSubItems();
            var subItem = subItems.find(function(el){return el.get('id')=='76666';});
            expect(subItem).toBeDefined();
        });

        it("Should find an item's sub-items (recursively)", function(){
            var subItems = item.getAllSubItems();
            var subItem = subItems.find(function(el){return el.get('id')=='1131059';});
            expect(subItem).toBeDefined();
        });
    })
});
