core.define('core.views.PasswordForgotten', {

    extend: 'core.views.Lightbox',

    template: ["User/PasswordForgotten.html"],

    events: {
        'click .button': 'resetPassword',
        'submit .passwordForgottenForm': 'resetPassword',
        'click .top-box .close-icon': 'hide'
    },
    
    hide: function(){
        delete this.options.errorMessage;
        core.views.PasswordForgotten.__super__.hide.call(this);
    },
    
    resetPassword: function(event){
        event.preventDefault();
        var val = this.$("input.input-default").val();
        this.hide();
        this.reset(val);
    },
    
    /**
     * resets the password via backbone model by the given email address
     * @param {Object} email
     */
    reset: function(email){
        var me = this;
        var model = this.options.Authorization || new core.models.Authorization();
        model.save({
                "email": email, "op": "reset"
            },{
                success: function(model, response){
                    if (response != null && response.errors != null){
                        _.each(response.errors, function(e){
                            if (e.error_code != null){
                                var errorCode = parseInt(e.error_code);
                                switch(errorCode){
                                    case 617:
                                    case 616:
                                        me.show();
                                        me.options.errorMessage = jsGetText("password_forgotten_not_found");
                                        break;
                                    default:
                                        me.show();
                                        me.options.errorMessage = jsGetText("error_happened_try_again");
                                }
                                return;
                            }
                        });
                    }
                    //TODO show the login box, was not in the master right now
                }, error: function(){
                    me.show();
                }
            }
        );
    }
});
