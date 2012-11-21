/** 
 * Checkout Form View Controller
 */
 
core.define('core.views.CheckoutForm', {

    extend: 'core.views.Form',

    events: {
        'submit' : 'submit',
        'keypress' : 'handleKeypress',
        'change select[name=preorder_day]' : 'renderPreOrderTime',
        'click input[name=delivery_time]': 'toggleOrderTime'
    },
    
    validationErrorsTemplate: 'Form/ValidationErrors.html',
    
    hiddenFields: "input[name=state]",
    
    initialize: function () {
        var self = this;

        this.delegateEvents();

        this.on('addressReady', this.addressReady, this);

        // this.$('input[name=delivery_time]').on('click', function(e) {
            
        // });
        
        if (!this.options.restaurant.general.open) {
            this.setPreorderTimesOnly();
        }

        if (this.options.activeAddress) {
            this.prefillFromActiveAddress();
        }
        
        this.renderPreOrderTime();
        
        core.views.CheckoutForm.__super__.initialize.call(this);

    },
    
    setPreorderTimesOnly: function() {
            this.$('.preorder input[value=now]').next('label').remove();
            this.$('.preorder input[value=now]').remove();
            this.$('.preorder input[value=preorder]').prop('checked', true);
    },
    
    prefillFromActiveAddress: function() {
        this.setValues(this.options.activeAddress);
    },

    error: function (model, e) {
        var me = this;
        var trackingErrorsMap = {
            invalid_zipcode: 'checkout_error_deliveryarea',
            name_required: 'checkout_error_field_first_name',
            lastname_required: 'checkout_error_field_last_name',
            phone_required: 'checkout_error_field_phone',
            invalid_pre_order_time: 'checkout_error_field_preorder',
            street_number_required: 'checkout_error_field_building_number',
            street_name_required: 'checkout_error_street',
            street_name_not_specified: 'checkout_error_street',
            email_required: 'checkout_error_field_email',
            suburb_required: 'checkout_error_suburb',
            restaurant_still_closed : 'checkout_error_field_preorder'
        }
        _.each(this.order.validationErrors, function(error){
            var attr = error.attr,
                msg = error.msg;
                if ( trackingErrorsMap.hasOwnProperty(msg) ) {
                    core.utils.trackingLogger.logError(trackingErrorsMap[msg], error.value || '');
                }

        });
        if (model.validationErrors.length > 0) {
            this.errors = model.validationErrors || [];
            this.showErrors();
            this.enableSubmit();
        }
    },
    
    setOrder: function(order) {
        
        this.order = order;
        this.order.on('error:checkout', this.error, this);

        if (order.get('status') === 'created') {
            return true;
        } else {
            this.errors = [{
                'attr': '',
                'msg': 'this_order_has_already_been_submitted'
            }];
            this.showErrors();
            return false;
        }
    },

    /**
     * Order time toggle handler
     * @param {Object} e The event object
     */
     
    toggleOrderTime: function (e) {
        var targetVal;
        targetVal = e.target.value;

        this.renderPreOrderTime();
                
        if ('now' === targetVal) {
            this.order.set('delivery_time','',{silent:true});
            this.$('.preorder select').prop('disabled', true).addClass('disabled');

        } else if ('preorder' === targetVal) {
            this.order.set('delivery_time','preorder',{silent:true});
            this.$('.preorder select').prop('disabled', false).removeClass('disabled');
        }
        
        this.$('.preorder select').trigger('change');    
    },

    /**
     * Render pre-order time dropdowns, conditionally
     * @param {Object} e An event object
     */
    renderPreOrderTime: function (e) {
        var day = this.$('select[name=preorder_day]').val();
        var openHours = {};
        var $preorderTimeSelect = this.$('select[name=preorder_time]');
        var $preorderDaySelect = this.$('select[name=preorder_day]');        
    
        if (_.isEmpty(this.options.today_times)) {
            $preorderDaySelect.find("option[value=today]").remove();
        }

        if (_.isEmpty(this.options.tomorrow_times)) {
            $preorderDaySelect.find("option[value=tomorrow]").remove();             
        }
        
        if (day === 'today') {
            openHours = this.options.today_times;
        } else if (day === 'tomorrow') {
            openHours = this.options.tomorrow_times;
        }

        $preorderTimeSelect.empty();

        // openHours maps a restaurant's local pre-order time to the same time in UTC (with date):
        // {'22:00': '2012-08-30T12:00:00Z', ...}
        var sortedLocalTimes = _.keys(openHours).sort();
        var utcTime;
        _.each(sortedLocalTimes, function(localTime) {
            utcTime = openHours[localTime];
            $preorderTimeSelect.append('<option value="' + utcTime + '">' + localTime + '</option>');
        });
        $preorderTimeSelect.trigger('select:update');
    },

    /**
     * Form submit event listener callback
     * @param {Object} e The event object
     * @param {Boolean} validateOnly If true, the form is just validated and not submitted.
     */
    submit: function (e, validateOnly) {
        var formData, self = this, order, address, deliveryAddress, deliveryTime, payment, validationErrors;
        
        if(!validateOnly){
            this.disableSubmit();
        }
        this.clearErrors();
        e.preventDefault();
        formData = this.getValues(this.hiddenFields);
        
        this.order.checkout(formData, validateOnly);
    },

    /**
    * Updates the order model from the form.
    */
    updateOrder: function(){
        var formData = this.getValues(this.hiddenFields);
        this.order.setFormData(formData);
    },

    /**
    * Handles the keypress event. If the user presses enter, validate the form but don't submit it.
    */
    handleKeypress: function(evt){
        if(evt.which == 13){
            this.submit(evt, true);
            evt.preventDefault();
        }
    }

});
