/**
 * Form for User login
 *
 * Example:
 *
 *     var form = new core.views.LoginForm({ model: theUser });
 *     form.renderTo($('#my_container'));
 *
 * @param {Object} model An instance of a user model
 */
core.define('core.views.LoginForm', {
    extend: 'core.views.Form',
    className: 'LoginForm',
    options: {
        template: 'Login/LoginForm.html'
    },
       
    events: {
        'keypress': 'submitOnEnter',
        'submit form': 'authorize',
        'click .submit': 'authorize'
    },
    
    /**
     * Constructor.
     * Instantiates an empty User model if none provided.
     * Renders the form with the provided template (defaults to Login/LoginForm.html).
     * Sets up authorize callbacks.
     * @param {Object} options A hash containing the view options
     */
    initialize: function(options) {
        var me = this,
            tpl = this.options.template;
        this.model = this.options.model || new core.models.User();

        this.model.on('authorize:grant', _.bind(this.authorizeSuccess, this));
        this.model.on('authorize:deny', _.bind(this.authorizeDeny, this));

        core.utils.getTemplate(this.options.template, function(tpl) {
            me.template = _.template(tpl);
            me.render();
        });

        if (this.options.show) {
            this.render();
        }
    },
    
    /**
     * Renders the widget using the given template.
     * @param {String} tpl The html template used to render the form
     */
    render: function(tpl) {
        this.$el.html(this.template());
        this.form = this.$('form');
        this.clearInvalidSimple();
        core.views.LoginForm.__super__.render.call(this);
    },

    refresh: function(submittable, errors) {
        this.$('p.message').empty();
        if (errors) {
            this.markInvalid(errors);
            this.$('p.message').html('<span class="error"><span class="error">' + jsGetText('login_error_credentials') + '</span></span>');
        }
        if (submittable) {
            this.$('.submit').removeClass('disabled');
        }
        else {
            this.$('.submit').addClass('disabled');
        }
    },

    /**
     * Tells if the form is submittable or not
     * @return {Boolean} True if the form can be submitted, false otherwise
     */
    isSubmittable: function() {
        return !this.$('.submit').is('.disabled');
    },

    /**
     * Validates login inputs and forward authorization query to the User model.
     */
    authorize: function() {
        if (!this.isSubmittable()) {
            return;
        }
        var data = this.getValues();
        this.model.set(data);
        if (this.model.isValid()) {
            this.refresh(false);
            this.model.authorize();
        } else {
            this.refresh(true, this.model.validationErrors);
        }
    },

    submitOnEnter: function(e) {
        if (e.which == 13) {
            this.authorize();
        }
    },

    /**
     * Authorization success handler.
     * @param {core.models.User} user The freshly authorized user
     */
    authorizeSuccess: function(user, token) {
        var bits = ['Hi,', user.get('name'), user.get('last_name'), '!'];
        this.$el.text(bits.join(' '));
    },

    /**
     * Authorization error handler.
     * @param {core.models.User} user The unauthorized user
     */
    authorizeDeny: function(user, errors) {
        this.refresh(true, [{attr: 'email'}, {attr: 'pwd'}]);
    },

    /**
     * Demo code
     */
    demo: function() {
        var form = new core.views.LoginForm();
        return form;
    }
});
