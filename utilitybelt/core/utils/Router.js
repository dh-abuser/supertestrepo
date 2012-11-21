/*
 * Router
 * Creates and returns the instance of the class according to the given token.
 * Takes care of waiting for DOM-ready event.
 * @param {String} className token (usually a class name)
 * @param {Object} The data received from the CMS
 *
 * @handle authorize:grant Refresh user and related cookies
 */
core.Router = function(className, data) {
    var env = pageEnv();

    $(document).ready(function() {
        var pageData = _.extend({}, data, env);
        var page = core.instantiate(className, pageData);
    });

    function pageEnv() {
        core.runtime.setupAuthHeader(core.runtime.apiKey, core.runtime.fetch('user_auth_token'));
        // track the user accross the app
        core.runtime.user = new core.models.User();

        // if auth info, refresh the app-wide user instance
        if (core.runtime.has('user_auth_token', 'user_id', 'user_email')) {
            core.runtime.user.set({
                'id': core.runtime.fetch('user_id'),
                'email': core.runtime.fetch('user_email')
            }, {silent: true});
            core.runtime.user.token = core.runtime.fetch('user_auth_token');
        }
        // if no cookie info, just set the available user id
        // TODO create a new user to rely less on cookies
        else {
            core.runtime.user.set({
                'id': core.runtime.fetch('user_id')
            }, {silent: true});
        }

        // if the user authorization has expired, delete any related cookie
        core.runtime.user.on('authorize:expire', function(user, token) {
            core.runtime.destroy('user_auth_token', 'user_id', 'user_email', 'session', 'exit_poll');
        });

        // logout callback: on successful logout, destroy cookies and redirect
        core.runtime.user.on('authorize:revoke', function(user, token) {
            core.runtime.destroy('user_auth_token', 'user_id', 'user_email', 'session', 'exit_poll');
            window.location.href = core.utils.formatURL('/');
        });

        // login callback: on successful login, persist auth info and reload the page
        core.runtime.user.on('authorize:grant authorize:anonym', function(user, token) {
            core.runtime.user = user;
            core.runtime.persist('user_auth_token', token);
            core.runtime.persist('user_id', user.id);
            core.runtime.persist('user_email', user.get('email'));
            core.runtime.setupAuthHeader(core.runtime.apiKey, token);
        });

        return {
            user: core.runtime.user,
            active_address: core.runtime.fetch('active_address', true)
        };
    }
};
