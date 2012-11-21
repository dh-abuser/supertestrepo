describe("MultipleLocation", function() {
    beforeEach(function() {
        this.locations = new core.collections.Locations([{
            "uri_search": "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=45.23234&long=37.77234",
            "address": {
                "city_slug": "berlin",
                "city": "Berlin",
                "street_number": "60",
                "latitude": 45.232340000000001,
                "country": "DE",
                "street_name": "Mohrenstrasse",
                "zipcode": "10117",
                "longitude": 37.77234
            }
        }, {
            "uri_search": "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=46.2004&long=37.88774",
            "address": {
                "city_slug": "berlin",
                "city": "Berlin",
                "street_number": "59",
                "latitude": 46.40000000000002,
                "country": "DE",
                "street_name": "Mohrenstrasse",
                "zipcode": "10117",
                "longitude": 37.887740000000001
            }
        }, {
            "uri_search": "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=46.2004&long=37.88774",
            "address": {
                "city_slug": "berlin",
                "city": "Berlin",
                "street_number": "59",
                "latitude": 46.200400000000002,
                "country": "DE",
                "street_name": "Mohrenstrasse",
                "zipcode": "10117",
                "longitude": 37.987740000000001
            }
        }, {
            "uri_search": "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=46.2004&long=37.88774",
            "address": {
                "city_slug": "berlin",
                "city": "Berlin",
                "street_number": "59",
                "latitude": 46.400400000000002,
                "country": "DE",
                "street_name": "Mohrenstrasse",
                "zipcode": "10117",
                "longitude": 37.987740000000001
            }
        }]);
        this.mockup = {};
        this.mockup.map = {
            hide: function() {
            },
            remove: function() {
            }
        };
        this.mockup.list = {
            remove: function() {
            }
        };
    });
    afterEach(function(){
        if (this.view != null){
            if (this.view.map == null){
                this.view.map = this.mockup.map;
            }
            if (this.view.list == null){
                this.view.list = this.mockup.list;
            }
            this.view.hide();
        }
    });

    describe("When instantiated", function() {
        beforeEach(function() {
            this.view = new core.views.MultipleLocationLightbox();
        });
        it("Correct DOM Element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });
    });

    describe("check if shown at the correct position", function() {
        beforeEach(function() {
            this.view = new core.views.MultipleLocationLightbox({ locations: this.locations });
            this.view.show();
            this.view.map = this.mockup.map;
            this.view.list = this.mockup.list;
        });
        afterEach(function() {
            this.view.hide();
        });
        it("check position", function() {
            var lbWidth = this.view.$el.width();
            expect(lbWidth).toBeGreaterThan(0);
            var lbHeight = this.view.$el.height();
            expect(lbHeight).toBeGreaterThan(0);
        });
    });
    describe("locations handled correctly", function() {
        beforeEach(function() {
            this.view = new core.views.MultipleLocationLightbox({
                locations: this.locations
            });
        });
        afterEach(function() {
            this.view = null;
        });
        it("check data is saved locally", function() {
            expect(this.view).toBeDefined();
            expect(this.view.locations).toBeDefined();
            expect(this.view.locations.length).toBe(this.locations.length);
        });
    });
    describe("window can be opened and also closed again without extra footprint", function() {
        it("showing lightbox", function() {
            this.view = new core.views.MultipleLocationLightbox( { locations: this.locations } );
            var mySpy = spyOn(this.view, "render").andCallThrough();
            this.view.show();
            expect(this.view.render).toHaveBeenCalled();
            expect(this.view.__shown).toBeTruthy();
            expect(this.view.$el).toBeDefined();
            expect(mySpy.callCount).toBe(1);
        });
        it("closing lightbox", function() {

            this.view = new core.views.MultipleLocationLightbox( { locations: this.locations } );
            this.view.map = this.mockup.map;
            this.view.list = this.mockup.list;
            this.view.show();

            var mySpy = spyOn(this.view.map, "hide");

            this.view.hide();
            expect(this.view.map).toBeDefined();
            expect(this.view.__shown).toBeFalsy();
            expect(mySpy).toHaveBeenCalled();
        });
    });
});
