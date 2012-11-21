/**
 * Form for account settings (password change)
 *
 * Example:
 *
 *     var form = new core.views.PasswordForm();
 *     form.renderTo($('#my_container'));
 *
 * @param {Object} user An instance of a user model
 */
core.define('core.views.PasswordForm', {
    extend: 'core.views.Form',
    className: 'PasswordForm',
    options: {
        template: 'Password/PasswordForm.html'
    },
       
    events: {
        'keypress': 'handleKeypress',
        'click .button.submit': 'updateDetails'
    },
    
    plugins: {
        'h4': 'jqTransform'
    },

    /**
     * Constructor.
     * Renders the form with the provided template (defaults to Password/PasswordForm.html).
     * @param {Object} options A hash containing the view options
     */
    initialize: function(options) {
        var me = this,
            tpl = this.options.template;

        this.model = this.options.user;
        this.originalModel = this.options.user;

        core.utils.getTemplate(this.options.template, function(tpl) {
            me.template = _.template(tpl , {
                email: me.model.get('email')
            });
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
        this.$el.html(this.template);
        this.form = this.$('form');
        this.message = this.$('h4');
        this.message.hide();
        core.views.UserAddressForm.__super__.render.call(this);
    },

    /**
    * Updates the view after form validation
    * @param {Array} errors The validation error
    * @param {String} errors.message An error message to be displayed
    */
    refresh: function(errors) {
        var errorMsgElt = this.$('.inputError');
        errorMsgElt.empty();
        if (errors) {
            this.markInvalid(errors);
            errorMsgElt.html( errors.message );
        }
     },

     /*
     * Validate the form to update the user's details (currently, only the password is supported)
     * If the validation is successful, make a request to the server and display the result message ("ok" or "error")
     * Otherwise, highlight invalid fields
     */
    updateDetails: function(){
        var formData = this.getValues();
        var me = this;
        this.model.set({
            email: formData.email,
            pwd: formData.pwd
        },{
            silent: true
        }); //explicitly set both properties: if the pwd field is empty, it is not in formData and the previous value of the property remains in the model
        this.model.validate();
        
        if (formData["pwd"] != formData["repeat_pwd"]) {
            //manually set an invalid status in the model
            this.model.validationErrors.push({attr:'pwd'});
            this.model.validationErrors.push({attr:'repeat_pwd'});
            this.model.validationErrors.message = jsGetText('passwords_donot_match');
        }

        if (this.model.isValid()) {
            if (!this.model.has('pwd')) this.model.unset('pwd', {silent: true}); //don't send an empty password to the API

            this.model.unset("email", {silent: true}); //FIXME the API won't allow a user to change their email address (unlike lieferheld.de). This line is ecessary for now
            this.model.save( {}, {
                success: _.bind(this.accountUpdated, this),
                error: function(){
                    var errors = [];
                    errors.message = jsGetText('settings_not_saved');
                    me.refresh(errors);
                },
                silent: true
            });
        } else {
            this.refresh(this.model.validationErrors);
        }
    },

    /**
    * Called when the user's details have been successfully updated on the server
    */
    accountUpdated: function(model, response){
        this.form.hide();
        this.message.show();
        var me = this;
        _.delay( function(){
            me.trigger( "hide" );
        }, 3000 );
    },

    /**
    * Handles the keypress event and updates the details if the user presses enter
    */
    handleKeypress: function(evt){
        if(evt.which==13){
            this.updateDetails();
        }
    },

    /**
     * Demo code
     */
    demo: function() {
        var form = new core.views.PasswordForm();
        return form;
    }
});
