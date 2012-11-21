/** Auth Model, represents the authentification of a user */

core.define('core.models.Authorization', {

    extend: 'core.Model',

    fields: {
        'email': { 'dataType': 'string', 'default': '' },
        'op': { 'dataType': 'string', 'default': ''}
    },

    validations: [
        { field: 'email', type: 'required', message_key: 'required' },
        { field: 'pwd', type: 'required', message_key: 'required' }
    ],

    initialize: function() {
    },

    url: function() {
        return '/api/authorization/';
    },
    
    isNew: function(){
        //this has to be faked otherwise the request will be a post and not a put
        //backbone documentation for model.save
        return false;
    },
    
    parse: function(response, xhr) {
        return response;
    },
    
    toJSON: function() {
        var json = {
            "email": this.get('email'),
            "op": this.get('op')
        };
        return json;
    }
});
