core.define('core.models.Location', {

    extend: 'core.Model',

    fields: {
        'zipcode': { 'dataType': 'number', 'default': '' },
        'city': { 'dataType': 'string', 'default': '' },
        'street_number': { 'dataType': 'string', 'default': '' },
        'street_name': { 'dataType': 'string', 'default': '' },
        'country': { 'dataType': 'string', 'default': '' },
        'longitude': { 'dataType': 'string', 'default': '' }, //? not a number?
        'latitude': { 'dataType': 'string', 'default': '' } //? not a number?
    },

    validations: [],

    initialize: function(){
    },

    url: function(){
        return "/api/locations/";
    },

    parse: function(resp, xhr){
        /* TODO - maybe some other way, this is done in order to use one model for both collection
         * and individual data API call
         */
        if(typeof resp.response === 'undefined'){
            return resp;
        }else{
            var serverResponse = resp.response;
            var parsed = {
                user_id: parseInt(serverResponse.user_id),
                id: parseInt(serverResponse.id)
            };
            parsed = _.extend(parsed, serverResponse.address || serverResponse);
            return parsed;
        };
    },

    toJSON: function(){
        var result = _.clone(this.attributes);
        if(!result.toCollection){
            delete result.user_id;
        };
        return result;
    },

    viewJSON: function(){
        var address = this.get('address'), result = _.clone(address);
        result.label = core.utils.formatAddress(address, 'full');
        return result;
    },

    urlRoot: '/addresses'

});