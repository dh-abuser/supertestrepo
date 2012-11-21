/**
 * Basic Page class, every app page should extend it.
 */
core.define('core.Page', {
    extend: 'core.View',

    /**
     * Constructor.
     * Sets up login or user actions for all pages.
     */
    initialize: function() {
        var user = this.options.user;

        // take over the whole page
        this.setElement($('body'));

        // always provide a login lightbox, in case of error 401
        var authorizeTool = new core.views.LoginLightbox({
            user: user,
            title: jsGetText('login_title')
        });

        this.on('render', function() {
            // set up user action trigger (either login or actions)
            var uat = {
                model: user,
                el: $('.button.login').parent(),
                authorizeTool: user.isAuthorized() ? false : authorizeTool
            };
            var userAccountTrigger = new core.views.UserAccountTrigger(uat);

            var knownAtLoading = user.isAuthorized();
            user.on('authorize:expire', function(user) {
                if (knownAtLoading) {
                    authorizeTool.show();
                }
                else {
                    user.makeAnonym();
                }
            });

            // set up a lightbox to display for ajax request errors
            var errorBox = new core.views.ErrorLightbox();

            this.$el.ajaxError(function(event, xhr, settings, error) {
                if (_.indexOf([500, 502], xhr.status) > -1 && !settings.silent) {
                    errorBox.show();
                }
                else if (401 === xhr.status) {
                    user.authorizeExpire();
                }
            });

            if (_.has(this.options, 'throbberDelay')) {
                var throbber = new core.views.Throbber({
                    fadeDelay: this.options.throbberDelay
                });
            }

        });
        this.render();

        core.Page.__super__.initialize.call(this);
    }
});
