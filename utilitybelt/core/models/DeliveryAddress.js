/** 
 * Delivery Address Model, represents city address defined via street and zipcode or city name 
 *
 */ 
core.define('core.models.DeliveryAddress', {

    extend: 'core.Model',

    fields: {
        'id': { 'dataType': 'number' },
        'uri': { 'dataType': 'string' },
        'user_id': { 'dataType': 'string' }
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'address',
            relatedModel: 'core.models.Address'
        }
    ],

    url: function(){
        try {
            if (this.get('user_id') && this.get('id')) {
                return '/api/users/' + this.get('user_id') + '/addresses/' + this.get('id') + '/';
            } else if (this.get('user_id')) {
               return '/api/users/' + this.get('user_id') + '/addresses/';
            }
        } catch(e) {
            console.error('UserAddressModel url could not be formed', e);
        }
    },

    toJSON: function(order) {
        var json = {};
        if (this.id) {
            json = { id: this.id, uri: this.get('uri') };
            if (this.has('address')) {
                json.address = this.get('address').toJSON();
            }
        } else if (this.has('address')) {
            if (this.post) {
                json = this.get('address').toJSON();
            } else {
                json = { address: this.get('address').toJSON() };
            }
        }
        return json;
    }
});
