/**
 * View for login / my account trigger
 *
 * @param {core.models.User} model The linked User
 */
core.define('core.views.UserAccountTrigger', {
    extend: 'core.View',
    className: 'UserAccountTrigger',
    events: {
        'click .login': 'showActions',
        'mouseleave': 'hideActions',
        'click li:nth-child(1) a': 'showPasswordLightbox',
        'click li:last-child a': 'logout'
    },
    options: {},

    initialize: function() {
        core.views.UserAccountTrigger.__super__.initialize.apply(this, arguments);
        this.options.model.on('authorize', _.bind(this.refresh, this));

        this.passwordLightbox = new core.views.PasswordLightbox({
            title: jsGetText('change_details'),
            user: this.options.model
        });
        
        _.defer(_.bind(this.refresh, this));
    },

    /**
     * Refreshes the view using the user authorization state.
     */
    refresh: function() {
        if (this.options.model.isAuthorized()) {
            this.$('>a').text(jsGetText('header_my_account_link'));
            this.$('>ul').hide();
        }
        else {
            this.$('>a').text(jsGetText('header_login_link'));
        }
    },

    render: function() {
        return core.views.Cart.__super__.render.call(this);
    },

    showActions: function(event) {
        var opts = this.options;
        if (opts.authorizeTool && !opts.model.isAuthorized()) {
            opts.authorizeTool.show();
        }
        else {
            var actions = this.$('>ul');
            if (!actions.is(':visible')) {
                actions.slideDown('fast');
            }
        }
    },

    hideActions: function(event) {
        var actions = this.$('>ul');
        if (actions.is(':visible')) {
            actions.slideUp('fast');
        }
    },

    showPasswordLightbox: function(){
        this.passwordLightbox.show();
    },

    logout: function() {
        this.options.model.revoke();
    }
});
