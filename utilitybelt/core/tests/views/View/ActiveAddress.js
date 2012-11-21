/*
 *  ActiveAddress Widget Tests
 *
 */

describe("core.views.ActiveAddress", function() {

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = '../../core/tests/fixtures/';
        loadFixtures('ActiveAddress.html');
        spyOn(core.views.ActiveAddress.prototype, 'hideSearchWidget').andCallThrough();
        spyOn(core.views.ActiveAddress.prototype, 'initLocationSearchWidget').andCallThrough();
        spyOn(core.views.ActiveAddress.prototype, 'showSearchWidget').andCallThrough();
        jQuery.fx.off = true;
    });

    describe("If active_address cookie DOES exist", function() {

        describe("When instantiated", function() {
                    beforeEach(function() {
                        core.runtime.persist('active_address', {"suburb": "Barangaroo", "state": "NSW", "zipcode": "2000", "city": "Sydney"}, true);
                        this.activeAddress = new core.views.ActiveAddress({
                            el: 'section.filter',
                            activeAddress: core.runtime.fetch('active_address', true)
                        });
                    });

                    it("should call initLocationSearchWidget method", function() {
                        expect(this.activeAddress.initLocationSearchWidget).toHaveBeenCalled();
                    });

                    it("should call hideSearchWidget method", function() {
                        expect(this.activeAddress.hideSearchWidget).toHaveBeenCalled();
                    });

                    describe("Hide Location Search widget from UI", function() {
                        it("should NOT call showSearchWidget method", function() {
                            expect(this.activeAddress.showSearchWidget).not.toHaveBeenCalled();
                        });

                       it("display:none CSS rule should exist", function() {
                           expect(this.activeAddress.locationSearchWidget.$el.css('display')).toEqual('none');
                       });

                       it("a click event on the 'change' link should reveal the Location Search Widget", function() {
                           this.activeAddress.$('.change').click();
                           expect(this.activeAddress.showSearchWidget).toHaveBeenCalled();
                           expect(this.activeAddress.locationSearchWidget.$el.css('display')).not.toEqual('none');
                       });

                    });

                    afterEach(function() {
                        core.runtime.destroy('active_address');
                    });
                });

    });

    describe("If active_address cookie DOES NOT exist", function() {
        describe("When instantiated", function() {

                    beforeEach(function() {
                        core.runtime.destroy('active_address');
                        this.activeAddress = new core.views.ActiveAddress({
                            el: 'section.filter'
                        });
                    });
        
                    it("should call initLocationSearchWidget method", function() {
                        expect(this.activeAddress.initLocationSearchWidget).toHaveBeenCalled();
                    });

                    it("should call hideSearchWidget method", function() {
                        expect(this.activeAddress.hideSearchWidget).toHaveBeenCalled();
                    });

                    it("should call showSearchWidget method", function() {
                        expect(this.activeAddress.showSearchWidget).toHaveBeenCalled();
                    });

                    describe("Show Location Search widget in UI", function() {

                        it("display:none CSS rule should NOT exist", function() {
                            expect(this.activeAddress.locationSearchWidget.$el.css('display')).not.toEqual('none');                                
                        });

                        describe("triggering a click event on .close", function() {
                            it("hides the widget from the UI", function() {
                                expect(this.activeAddress.hideSearchWidget).toHaveBeenCalled();
                                expect(this.activeAddress.locationSearchWidget.$el.css('display')).not.toEqual('none'); 
                            });
                        });

                    });

                });

                afterEach(function() {
                    core.runtime.destroy('active_address');
                });

        });
});