/**
 * User model.
 */
core.define('core.models.User', {
    extend: 'core.Model',

    fields: {
        'id': { 'dataType': 'number' },
        'name': { 'dataType': 'string' },
        'last_name': { 'dataType': 'string' },
        'email': { 'dataType': 'string' },
        'pwd': { 'dataType': 'string' },
        'phone': { 'dataType': 'string' },
        'created_at': { 'dataType': 'string' },
        'op': { 'dataType': 'string' }
    },

    validation: {
        'email': [
            { check: 'required' },
            { check: 'email' }
        ],
        'pwd': [
            { check: 'required' },
            { check: 'notEmpty' }
        ]
    },

    initialize: function(attributes, options) {
        this.token = false;
    },

    /**
     * Authorization function.
     * Tries to fetch a user having the user email and password.
     */
    authorize: function() {
        return this.fetch({
            url: ['/api/authorization/?email=', this.get('email'), '&pwd=', this.get('pwd')].join(''),
            success: function(user, response) { user.authorizeGrant.call(user, response); },
            error: function(user, xhr) { user.authorizeDeny.call(user, xhr); }
        });
    },

    /**
     * Authorization granted handler.
     * Sets the user token and fires a grant event.
     *
     * @param {Object} response The JSON response
     * @trigger authorize:grant (User, token) when the authorization is successful
     * @throw error when no token is available
     */
    authorizeGrant: function(response) {
        if (!response.token) {
            throw "authorization-has-no-token";
        }
        this.token = response.token;
        this.trigger('authorize:grant', this, response.token);
    },

    /**
     * Authorization denied handler.
     * Resets the user token to false and fires a deny event.
     *
     * @param {Object} xhr The jqXHR
     * @trigger authorize:deny (User, reponse) when the authorization failed
     */
    authorizeDeny: function(xhr) {
        this.token = false;
        this.trigger('authorize:deny', this, jQuery.parseJSON(xhr.responseText));
    },

    /**
     * Tells if the user is authorized.
     *
     * @return {Boolean} A boolean telling if the user is autorized or not
     */
    isAuthorized: function() {
        return Boolean(this.token) && this.has('email');
    },

    /**
     * Revokes the authorization.
     *
     * @trigger authorize:revoke (User) when the authorization is revoked
     */
    revoke: function() {
        return this.save(null, {
            url: '/api/authorization/?op=logout',
            success: function(user, response) { user.revokeGrant.call(user, response); },
            // error: function(user, xhr) { user.revokeDeny.call(user, xhr); },
            // rely on server response, do not validate anything
            silent: true
        });
    },

     /**
     * Authorization revoked handler.
     * Resets the user token to false and fires a deny event.
     *
     * @param {Object} response The JSON response
     * @trigger authorize:grant (User) when the authorization was successfully revoked
     */
   revokeGrant: function(response) {
        this.unset('email', {silent: true});
        this.token = false;
        this.trigger('authorize:revoke', this);
    },

    authorizeExpire: function() {
        this.unset('id', {silent: true});
        this.token = false;
        this.trigger('authorize:expire', this);
    },

    /**
     * Turns the user to an anonym one. That means it's temporary authorized
     * by the API but does not have credentials.
     * When the token or ID is lost, such a user cannot be used anymore.
     */
    makeAnonym: function() {
        this.save('', {
            silent: true,
            success: function(user, response) {
                user.token = response.token;
                user.trigger('sync');
                user.trigger('authorize:anonym', user, response.token);
            }
        });
    },

    url: function() {
        if (this.has('op'))
            return '/api/users/?op=' + this.get("op") + "&email=" + this.get("email");
        else
            return '/api/users/' + (this.isNew() ? '' : this.id + '/');
    },
    
    /**
     * Prepares a settable attribute set from the API JSON.
     * @param {Object} response The JSON response from the API
     * @param {jqXHR} xhr The jqXHR
     */
    parse: function(response, xhr) {
        if (response.user && response.user.general) {
            var attrs = _.extend({
                id: response.user.id
            }, response.user.general);
            return attrs;
        }
        return response;
    },
    
    toJSON: function() {
        var json = {
            "name": this.get('name'),
            "lastname": this.get('lastname'),
            "birthdate": this.get('birthday'),
            "phone": this.get('phone'),
            "email": this.get('email'),
            "op": this.get('op')
        };
        if(this.get('pwd')){
            json['pwd'] = this.get('pwd');
        }
        return json;
    }
});
