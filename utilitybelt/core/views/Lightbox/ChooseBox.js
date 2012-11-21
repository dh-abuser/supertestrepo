/**
 * Lightbox for choosing 
 *  a) to keep the current active address 
 * or
 *  b) to search again 
 *
 * Examples:
 *
 *     var cb = new core.views.ChooseLightbox();
 *     cb.show();
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.ChooseLightbox', {

    extend : 'core.views.Lightbox',
    
    template: 'PLZ/choose_lightbox.html',
    
    events : {
        "click .proceed" : "proceed",
        "click .back" : "back"
    },
    
    options: {
        blanketId: "light_blanket",
        blanketClickToClose: true
    },

    className : 'ChooseLightbox',
    
    proceed: function(){
        core.utils.redirectLocation(this.options.activeAddress);
    },
    
    back: function(){
        this.trigger("show:search");
    },
    
    setRestaurantId: function(restaurantId){
        this.options.restaurantId = restaurantId;
    },
    
    setAddress: function(address){
        this.options.activeAddress = address;
    }, 
    
    show: function(restaurantName){
        this.options.renderData = {
            restaurantName:  restaurantName,
            activeAddress : (this.options.activeAddress.get('address').zipcode + " " + this.options.activeAddress.get('address').city)
        };
        core.views.ChooseLightbox.__super__.show.call(this);
        //this.setTitle(jsGetText("location_box_title", restaurantName));
    }

});
