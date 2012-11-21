
describe("GeoLocations", function() {

    describe("It can be created and initialized", function() {

        it("Creates", function() {
            var loc = new core.collections.GeoLocations();
            expect(loc).toBeDefined();
        });

    });

    describe("Behaves as expected", function() {

        beforeEach(function() {
            this.srv = sinon.fakeServer.create();
            this.url = /\/api\/geo/;
            this.headers = {"Content-Type": "application/json"};
            this.srv.respondWith("GET", this.url, [
                200,
                this.headers,
                '{"pagination": {"total_items": 3, "total_pages": 1, "limit": 10, "page": 1, "offset": 0}, "data": [{"geo_area": {"city": "Sydney", "state": "NSW", "zipcode": "2060", "suburb": "Sydney"}}, {"geo_area": {"city": "Sydney", "state": "NSW", "zipcode": "2000", "suburb": "North Sydney"}}, {"geo_area": {"city": "Sydney", "state": "NSW", "zipcode": "2127", "suburb": "Sydney Olympic Park"}}]}'
            ]);
        });

        afterEach(function() {
            this.srv.restore();
        });


        it("Only sets correct URL parameters", function() {
            var geoLocations = new core.collections.GeoLocations();
            
            expect(function(){
                geoLocations.setUrlParams({ foo: 'bar' });
            }).toThrow();
        });

        it("Correctly parses data from the API", function(){
            var geoLocations = new core.collections.GeoLocations();
            geoLocations.setUrlParams({
                suburb: "Sydney"
            });

            var goodMatch = false;
            geoLocations.fetch({
                success: function(locations){
                    var normalisedAddressParts = locations.models[0].get('geo_area');
                    goodMatch = normalisedAddressParts['suburb'] == "Sydney";
                }
            });

            this.srv.respond();

            expect(goodMatch).toBeTruthy();
        });
    });
});