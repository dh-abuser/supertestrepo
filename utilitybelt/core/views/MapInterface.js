/*
 * Map Interface
 */
core.define('core.views.MapInterface', {

    extend: 'core.View',

    template: '',

    className: "MapInterface",

    /*
     * Constructor
     * @returns core.views.Form
     * @constructor
     */
    initialize: function(options) {
        //do the require here...
        //throw new Error("this is just an interface and has to be implemented");
    },

    /**
     *
     * @param {Object} markers
     */
    addMarkers: function(markers) {
        // throw new Error("this is just an interface and has to be implemented");
    },

    /**
     *
     */
    removeAllMarkers: function() {
        // throw new Error("this is just an interface and has to be implemented");
    },
    /**
     *
     */
    removeMarkers: function() {
        // throw new Error("this is just an interface and has to be implemented");
    },
    /**
     * @returns
     */
    getServiceName: function() {

    },
    
    addListener: function(){
        
    },

    demo: function() {

    }
});
