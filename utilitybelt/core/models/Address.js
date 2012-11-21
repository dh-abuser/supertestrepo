
/** Address Model, represents city address defined via street and zipcode or city name */

core.define('core.models.Address', {

    extend: 'core.Model',

    fields: {
        'id': { 'dataType': 'number' },
        'user_id': { 'dataType': 'number' },
        'city_slug': { 'dataType': 'string' },
        'city': { 'dataType': 'string' },
        'door': { 'dataType': 'string' },
        'etage': { 'dataType': 'number' },
        'street_number': { 'dataType': 'string' },
        'salutation': { 'dataType': 'string' },
        'lastname': { 'dataType': 'string' },
        'street_name': { 'dataType': 'string' },
        'zipcode': { 'dataType': 'number' },
        'comments': { 'dataType': 'string' },
        'name': { 'dataType': 'string' },
        'country': { 'dataType': 'string' },
        'phone': { 'dataType': 'string' },
        'longitude': { 'dataType': 'string' },
        'latitude': { 'dataType': 'string' },
        'state': { 'dataType': 'string' },
        'suburb': { 'dataType': 'string' },
        'unit_number': { 'dataType': 'string' }
    },

/*
    url: function() {
        return 'http://mockapi.lieferheld.de/v2/users/u1/addresses/';
    },
*/

    validation: {
        name: [{ check: 'required', msg: 'name_required' }, {check: 'notEmpty'}],
        lastname: [{ check: 'required', msg: 'lastname_required' }, {check: 'notEmpty'}],
        street_number: [{ check: 'required', msg: 'street_number_required' }, {check: 'notEmpty'}],
        street_name: [{ check: 'required', msg: 'street_name_required' }, {check: 'notEmpty'}],
        suburb: [{ check: 'required', msg: 'suburb_required' }, {check: 'notEmpty'}],
        zipcode: [{ check: 'required', msg: 'zipcode_required' }, {check: 'notEmpty'}],
        state: [{ check: 'required', msg: 'state_required' }, {check: 'notEmpty'}],
        phone: [{ check: 'required', msg: 'phone_required' }, {check: 'notEmpty'}]
    },

    urlRoot: '/addresses',

    //don't use core.Model initializer, which sets attributes to `undefined` if not passed to the constructor
    initialize: function(){},


    requiredParams: function(){
        if (!this.get('user_id')) {
            throw new Error('UserAddressModel user_id not provided');
        }
        if (typeof this.get('user_id') !== 'number') {
            throw new Error('UserAddressModel user_id wrong type');
        }
    },

    url: function() {
        try {
            if (this.get('user_id') && this.get('id')) {
                return '/users/' + this.get('user_id') + '/addresses/' + this.get('id') + '/';
            } else if (this.get('user_id')) {
               return '/users/' + this.get('user_id') + '/addresses/';
            }
        } catch(e) {
            console.error('UserAddressModel url could not be formed', e);
        }
    },

    parse: function(resp, xhr) {
        /* TODO - maybe some other way, this is done in order to use one model for both collection
         * and individual data API call
         */
        if (typeof resp.response === 'undefined') {
            return resp;
        } else {
            var serverResponse = resp.response;
            var parsed = {
                user_id: parseInt(serverResponse.user_id),
                id: parseInt(serverResponse.id)
            };
            parsed = _.extend(parsed, serverResponse.address || serverResponse);

            return parsed;
        }
    },

    /**
    * Transforms the mdoel to JSON. Does not include empty fields so a shallow comparison with another JSON address can be performed.
    */
    toJSON: function(){
        var json = {};
        _.each(this.attributes, function(value, key){
            if (value || value === 0) {
                json[key] = value;
            }
        });
        return json;
    },
});
