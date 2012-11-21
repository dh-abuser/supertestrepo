describe("MultipleLocationList", function() {
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
        this.mockup.list = {
            remove: function() {
            }
        };
    });
    afterEach(function() {
        if(this.view != null) {
            this.view.remove();
            this.view == null;
        }
    });
    describe("When instantiated", function() {
        beforeEach(function() {
            this.view = new core.views.MultipleLocationList({ locations: this.locations });
        });
        it("test dom structure", function() {
            expect(this.view.el.nodeName).toBe("UL");
            expect(this.view.$el.hasClass("unstyled")).toBeTruthy();
        });
    });
    describe("locations handled correctly", function() {
        beforeEach(function() {
            this.view = new core.views.MultipleLocationList({
                locations: this.locations
            });
        });
        it("showing the same amount of elements", function() {
            expect(this.view.el.children.length).toBe(this.locations.length);
        });
    });
    describe("show and hide also the list and no extra dom footprint should exist", function() {
        beforeEach(function() {
            this.view = new core.views.MultipleLocationList({ locations: this.locations });
        });
        it("check that list is shown correctly", function() {
            this.view.render();
            expect(this.view.$el.parent().length).toBe(0);
        });
        it("check removing from the dom", function() {
            this.view.render();
            $('body').append(this.view.el);
            expect(this.view.$el.parent().length).toBe(1);
            this.view.remove();
            expect(this.view.$el.parent().length).toBe(0);
        });
    });
});
