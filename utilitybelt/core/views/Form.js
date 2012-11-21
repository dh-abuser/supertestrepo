/*
 * Basic Form widget
 */
core.define('core.views.Form', {

    extend: 'core.View',

    className: "Form",

    /*
     * Define events mapping
     */
    events: {
      "click input.submit": "submit",
      "submit form": "submit",
      "keypress input[type=text],textarea": "keypress"
    },

    plugins: {
        'form *': 'placeholder'
    },

    enableHtml5Features: false,
    
    /*
     * Constructor
     * @returns core.views.Form
     * @constructor
     */
    initialize: function() {
        if (!this.enableHtml5Features) {
            // Supress HTML5 client side validation
            // see: http://www.w3.org/TR/html5/attributes-common-to-form-controls.html#attr-fs-novalidate
            //  - for caveats see: http://stackoverflow.com/a/5477753
            this.$el.attr('novalidate',true);
        }
        
        this.validations = this.options.validations;
    },

    /*
     * Focus on the first field and select its content
     */
    selectFirstField: function() {

        var fields = $('input:visible', this.el);
        if (fields && fields[0]) {
            var field = $(fields[0]);
            if (field && field.focus && field.val) {
                field.focus();
                if (field.val()!=='' && field.val()!=field.attr('placeholder'))
                    field.select();
            }
        }
    },

    /*
     * Mark fields via flashing in this form invalid in bulk.
     * @param {ArrayOfObject} errors Array of errors
     */
    markInvalid: function(errors) { // TODO: rewrite completely, animation is terrible
        function animateField(field, count, cb) {
            field.stop();
            field.animate({backgroundColor: '#fffcb7'}, 300, function() {
                field.animate({backgroundColor: '#fff'}, 200, function()  {
                    if (--count)
                        animateField(field, count, cb);
                    else
                        cb(field);
                });
            });
        }

        _.each(errors, function(error) {
            var input = $('input[name="' + error.attr + '"]:visible', this.el);

            // Save placeholder value before flashing
            if (input.attr('placeholder')) {
                input.data('placeholder', input.attr('placeholder'));
                input.attr('placeholder', '');
            }

            //-- Saving background --
            if (!input.data('bg')) {
                input.data('bg', input.css('background-color'));
            }

            //adding error message if defined and put in html pwojcieszuk
            if(input.parent().children('.error_message').size() > 0)
                input.parent().children('.error_message').text(error.msg);

            if (input.animate) {
                animateField(input, 3, function(field) {
                    if (input.data('placeholder'))
                        field.attr('placeholder', input.data('placeholder'));
                    if (input.data('bg'))
                        field.css('background-color', input.data('bg'));
                });
            }
        });
        return false;
    },

    /*
     * Mark invalid via simple label color change
     * @param {ArrayOfObjects} errors Array of errors
     */
     markInvalidSimple: function(errors) {
         var form = this.$el;
         this.clearInvalidSimple();
         for (var i=0,ii=errors.length; i<ii; i++) {
             var error = errors[i];
             $(':input[name="' + error.attr + '"]', form).parent().addClass('input-error');
         }
     },

    /*
     * Clear invalid simple
     */
    clearInvalidSimple: function() {
        var form = this.$el;
        $('input', form).parent('div').removeClass('input-error');
    },

    /*
     * Show inline loading spinner
     */
    showSpinner: function() {
        $('.spinner', this.el).show();
    },

    /*
     * Hide inline loading spinner
     */
    hideSpinner: function() {
        $('.spinner', this.el).hide();
    },

    /*
     * Set form values
     * @param {ArrayOfObjects} values Array of values
     */
    setValues: function(mdl) {

        var values =  mdl.attributes || mdl;

        if (values) {
            for (var field in values) {
                var field_el = $('input[name="' + field + '"]', this.el);
                if (field_el.length)
                    field_el.val(values[field]);
            }
        }
    },

    /*
     * On key press handler
     */
    keypress: function(ev) {
        /*if there was an error message and the input is being filled again, remove error message*/
        var changedInput = $("input[name='" + ev.target.name +"']");
        if(changedInput.parent().children('.error_message').size() > 0)
            changedInput.parent().children('.error_message').text('');
    },

    /*
     * Send form data via jQuery's Ajax call
     * Use inline spinner as a loading indicator
     * @param {Object} data Form data
     * @param {Object} options Ajax call options ('url', 'type' and 'success' for success callback)
     */
    send: function(data, options) {
        var me = this;
        this.showSpinner();
        $.ajax({
            url: options.url,
            type: options.type || 'post',
            dataType: 'json',
            success: _.bind(options.success, this),
            error: function()  { me.hideSpinner(); console.log('error', arguments); },
            data: data
        });
    },

    /*
     * Submit form handler
     * Serialize form data and validate it. If validation succeeds, send it, if failed -- use markInvalid to mark errors
     * @param {Object} data Form data
     * @param {Object} options Ajax call options ('url', 'type' and 'success' for success callback)
     */
    submit: function() {
        var options = this.options, validations = this.validations, me = this;
        var form = this.options.form || this.el;
        var data = this.getValues();
        var errors = this.validate(data, validations);

        if (!errors.length) {
            this.send(data, options);
        }
        else {
            this.markInvalid(errors);
        }

        return false;
    },

    /*
     * Serialize and returns Form data as a JSON
     * @param {String} extraElementsSelector If provided, the elements described by this jQuery selector will also be serialized (useful e.g. to include hidden elements)
     */
    getValues: function(extraElementsSelector) {
        var data = {}, formData = this.$(':input:visible,input:checked,select').add(this.$(extraElementsSelector)).serializeArray();
        _.each(formData, function(el) {
            if (el.value) {
                data[el.name] = el.value;
            }
        });
        return data;
    },
    
    /*
     * Clear validation errors
     *
     */
    clearErrors: function() {
        
        this.errors = [];
        
        $('input, select, textarea, label', this.el).removeClass('invalid');
        $('.error_messages', this.el).remove();  

    },
    
    
    /*
     * Map validations to form inputs and display validation errors
     * 
     */
    showErrors: function(model,errors) {
        var self = this;
        errors = errors || this.errors;
        
        core.utils.getTemplate(self.validationErrorsTemplate, function(tpl) {
            var _tpl = _.template(tpl, {'errors': errors});
            self.$('.error_messages').remove();
            self.$el.append(_tpl);
        
        });

        _.each(errors, function (error) {
            if(_.isArray(error.attr)) {
                _.each(error.attr, function(attr) {
                    self.$('input[name=' + attr + '], label[for=' + attr + '], label.' + attr, this.el).addClass('invalid');
                });
            } else if(error.attr != '') {
                self.$('input[name=' + error.attr + '], label[for=' + error.attr + '], label.' + error.attr, this.el).addClass('invalid');
            }
        });
    },
    

    /*
     * Validate the form data and save the Model if validated successfully, mark errors otherwise
     */
    formValidate: function() {
        var data = this.getValues();
        this.model.set(data, { silent: true });
        if (this.model.isValid()) {
            this.model.save( {}, { success: this.options.onSuccess } );
        } else {
            var errors = this.model.validationErrors;
            this.markInvalidSimple(errors);
        }
    },
    
    /**
     * Enable Form Submit Button
     */
    enableSubmit: function() {
      this.$el.find('input:submit').prop('disabled', false).removeClass('disabled');
    },
    
    /**
     * Disable Form Submit Button
     */
    disableSubmit: function() {
      this.$el.find('input:submit').prop('disabled', true).addClass('disabled');
    },

    demo: function() {
        return $('<div><p>See <a href="#core.views.UserAddressForm">core.views.UserAddressForm</a></p></div>');
    }
});
