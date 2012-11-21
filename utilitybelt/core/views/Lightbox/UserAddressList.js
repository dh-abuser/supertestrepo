/** 
* Lightbox with the User Addresses List inside 
*
* Examples:
*
*     var lb = new core.views.UserAddressListLightbox();
*     lb.show();
*
* @extends core.views.Lightbox
 */

core.define('core.views.UserAddressListLightbox', {

    extend: 'core.views.Lightbox',
	
    className: 'UserAddressListLightbox',
        
/**
 * Initialize
 * @method initialize
 * @constructor
 * @param {Object} options Options
 */

    initialize: function(options){
   
        this.title = jsGetText('address_list');
	                
        var user_id = this.options.user_id;
        
        this.on('render', function() { 
            var lb = this;
            lb.addTitleLink(jsGetText('new_address')).addClass('new-address').click(function() {
                var form = new core.views.UserAddressLightbox({ title: jsGetText('new_address'), user_id: user_id });
                form.show();
                lb.hide();
	            });
            this.options.openEditWidget = function(options) {
                options.user_id = user_id;
                var form = new core.views.UserAddressLightbox(options);
                form.show();
                lb.hide();
            };

            var list = this.addItem(core.views.UserAddressList, this.options);
            this.setAddressList(list);

	    	});	

        core.views.UserAddressListLightbox.__super__.initialize.call(this);
            
    },

    setAddressList: function(list) {
        this.addressList = list;
    },

    getAddressList: function() {
        return this.addressList;
    },

    demo: function() {
        var $result = $('<a class="button">Click Me</a>')
        .click( function() {
            var lb = new core.views.UserAddressListLightbox({ user_id: 1 });
            lb.show();
        });
        return $result;
    }

});