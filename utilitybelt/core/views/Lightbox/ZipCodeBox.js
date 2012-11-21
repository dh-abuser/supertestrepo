/**
 * Lightbox showing the search location input
 *
 * Examples:
 *
 *     var zb = new core.views.ZipCodeLightbox();
 *     zb.show();
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.ZipCodeLightbox', {

    extend : 'core.views.Lightbox',
    
    template: 'PLZ/zip_code_lightbox.html',

    plugins: {
        'form *': 'placeholder',
        '.zip-input input': [ 'autocomplete', { 
            'source': 'suggestLocation',
            'select': 'onSelectSuggestedLocation',
            'minLength': 2,
            'position': { offset: '0 -3' },
            'delay': 300 
        } ]
    },
    
    events : {
        "submit .zip-input": "suggestOnEnter",
        "click .button.big": "suggestOnEnter"
    },

    mixins: ['core.mixins.AutosuggestLocations'],
    
    options: {
        blanketId: "light_blanket",
        blanketClickToClose: true
    },
    
    __disabled: false,

    className : 'ZipCodeLightbox',

    getSearchInputField: function() {
        if (!this.searchInputField)
            this.searchInputField = $('.zip-input input');
        return this.searchInputField;
    },

    show: function(restaurantName){
        this.options.renderData = {
            "restaurantName": restaurantName
        };
        
        core.views.ZipCodeLightbox.__super__.show.call(this);
        //this.setTitle(jsGetText("location_box_title", restaurantName));
    }

});
