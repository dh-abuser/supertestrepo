 /** 
 * Lightbox with the User Address Form inside 
 *
 * Examples:
 *
 *     var lb = new core.views.UserAddressLightbox({ id: 1, title: jsGetText('save_address') }); // fetch the record from the back-end
 *     lb.show();
 *
 *     var lb2 = new core.views.UserAddressLightbox({ record: { ... } }); // use the predefined record
 *
 *     var lb3 = new core.views.UserAddressLightbox({ title: jsGetText('new_address') }); // open empty form
 *     lb3.on('render', function(lightbox) {  // populate with data
 *         lightbox.getForm().populate( { ... } ) 
 *     });
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.UserAddressLightbox', {

    extend: 'core.views.Lightbox',
       
/**
 * Initialize
 * @method initialize
 * @constructor
 * @param {Object} options Options
 */
       
    initialize: function(options){
       
        var options = this.options;
    
        this.on('render', function() { 
            var lb = this;
            this.options.onSuccess = function() { 
                lb.hide(); 
            	new core.views.UserAddressListLightbox(options).show();
            };
            this.options.onBackLinkClick = function() { 
                lb.hide(); 
            	new core.views.UserAddressListLightbox(options).show();
            };
            this.addItem(core.views.UserAddressForm, this.options);
        });

        core.views.UserAddressLightbox.__super__.initialize.call(this);

    },

    demo: function() {
        var $result = $('<a class="button">Click Me</a>')
        .click( function() {
            var lb = new core.views.UserAddressLightbox({ id: 1, title: jsGetText('save_address') });
            lb.show();
        });
        return $result;
    }
    
    
});