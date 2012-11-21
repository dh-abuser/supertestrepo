describe("GoogleMaps", function() {
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

    });

    it("successfully loads Google Map in a 3 secs", function() {

        var mapsDomElement = $(document.createElement("DIV"));
        mapsDomElement.height("300px");
        mapsDomElement.width("200px");
        mapsDomElement.css({
            "position": "relative",
            "left": "0px",
            "top": "0px"
        });
        mapsDomElement.attr("class", "__maps");
        $('body').append(mapsDomElement);
        var me = this;

        me.view = new core.views.Map({
            "locations": this.locations,
            "domNode": mapsDomElement
        });

        for(var i = 0; i < 10; i++) {
            var mde = mapsDomElement.clone();
            mde.css({
                "left": "0px"
            });
            mde.attr("class", "__maps");
            $('body').append(mde);
            var m = new core.views.Map({
                "locations": this.locations,
                "domNode": mde
            });
          
        }

        waitsFor(function() {
            return me.view.__loaded;
        }, "still waiting and nothing happens", 3000);

        runs(function() {
            expect(me.view.__loaded).toBeTruthy();
            $('.__maps').remove();
        })
    });

});
