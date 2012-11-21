/*
 * Google map wrapper
 */
core.define('core.views.Map', {

    extend: 'core.views.MapInterface',

    className: "Map",
    __loaded: false,

    markers: [],

    /*
     * Constructor
     * @returns core.views.Form
     * @constructor
     */
    initialize: function(options) {
        var me = this;
        this.options = options;
        this.__loaded = (window.google != null && window.google.maps != null && window.google.maps.Map != null);
        this.on("render", function() {
            if(me.__loaded) {
                me.showMap();
            }
        });
        //do the require here
        if(!this.__loaded) { 
            if(window.mapLoadedObserver == null) {
                window.mapLoadedObserver = {
                    mapLoaded: function() {
                        $(window.mapLoadedObserver).trigger("loaded");
                        delete (window.mapLoadedObserver);
                    },
                    addMapLoadedHandler: function(func, context){
                        $(window.mapLoadedObserver).bind("loaded", _.bind(func, context));
                    }
                };
                var url = 'http://maps.google.com/maps/api/js?sensor=false&callback=window.mapLoadedObserver.mapLoaded';
                if(core.MapConfig != null && core.MapConfig.GOOGLE_MAP_KEY != null && core.MapConfig.GOOGLE_MAP_KEY.length > 0) {
                    url += '&key=' + core.MapConfig.GOOGLE_MAP_KEY;
                }
                require([url], function() {
                });

            }
            // window.mapCallback = _.bind(function() {
            // this.mapLoaded();
            // delete (window.mapCallback);
            // }, this);
            window.mapLoadedObserver.addMapLoadedHandler(me.mapLoaded, me);
        };

    },
    /**
     * needed as a callback function to listen to
     */
    mapLoaded: function() {
        this.__loaded = true;
        this.showMap();
    },
    /**
     * shows the map in the dom, because of the internal asynhronous loading of google maps
     */
    showMap: function() {
        var mapDiv = null;
        if(this.options.domNode != null) { 
            mapDiv = $(this.options.domNode);
        } else {
            mapDiv = $('.maps');
        }

        if(mapDiv.length != null && mapDiv.length > 0) {
            mapDiv = mapDiv[0];
        }
        else {
            mapDiv = $('<div></div>')[0];
        }

        // create the map
        this.map = new google.maps.Map(mapDiv, {
            // center: new google.maps.LatLng(0, 0),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            }
        });
        //adding the markers on the map
        this.markers = [];
        this.latLngBounds = new google.maps.LatLngBounds();
        var me = this;
        this.options.locations.each( function(elem, index) {
            var singleMarker = this.createMapMarker(elem.get('address'), index);
            google.maps.event.addListener(singleMarker, 'click', function() {
                me.handleMarkerClick.call(me, elem);
            });
            this.markers.push(singleMarker);
            this.latLngBounds.extend(singleMarker.position);
        }, this);
        //setting the center and the correct zoom level
        this.map.setCenter(this.latLngBounds.getCenter());
        this.map.fitBounds(this.latLngBounds);
    },
    /**
     * handler for the marker clicking on the map
     * @param {google.maps.Marker} elem which has been clicked on the map
     */
    handleMarkerClick: function(elem) {
        this.trigger("markerClick", elem);
    },
    /**
     *
     * @param {Object} address the address object with street, latitude, longitude, etc...
     * @param {Number} the index number for knowing which element has been clicked later on
     */
    createMapMarker: function(addressObject, index) {
        return new google.maps.Marker({
            map: this.map,
            title: addressObject.street,
            icon: core.utils.getIcon('mapMarker', index),
            addressObject: addressObject,
            index: index,
            position: new google.maps.LatLng(addressObject.latitude, addressObject.longitude)
        });
    },
    /**
     * removes all markers from the map
     */
    removeAllMarkers: function() {
        _.each(this.markers, function(marker) {
            // for (var marker in this.markers){
            marker.setMap(null);
        });
        this.markers = [];
    },
    /**
     * @return {String} which service is being used
     */
    getServiceName: function() {
        return "Google Maps";
    },
    /**
     * removes all markers and also the element itself from the DOM
     */
    hide: function() {
        this.removeAllMarkers();
        this.remove(); // TODO: make sure we're remove all Google Map's events as well
    }
});
