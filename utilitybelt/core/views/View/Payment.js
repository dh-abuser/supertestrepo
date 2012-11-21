/**
 * View for displaying the Payment box on the checkout page
 *
 * Example:
 *
 *     var paymentView = new core.views.Payment();
 *
 * @param {Array} payment_methods An array of valid payment methods. See http://mockapi.lieferheld.de/doc/reference/data/payment_method.html
 */
core.define('core.views.Payment', {
    extend: 'core.View',
    className: 'Payment',
    events: {
        "click li.paymentBox" : "selectPaymentMethod",
        "keypress .order_form_coupon_code" : "scheduleCouponValidation",
        "paste .order_form_coupon_code" : "scheduleCouponValidation"
    },
    plugins:{
        //'.orderform': 'jqTransform', //disabling to remove flickering when re-rendering view
    },
    options: {
        template: "Payment/payment.html"
    },

    /**
    * @params See Top of the file
    */
    initialize: function(options) {
        var me = this;
        this.order = options.order;

        core.utils.getTemplate(me.options.template, function(tpl) {
            me.tpl = tpl;
            me.render();
            me.order.on("sync", function(view, response){
                var poppedCoupon = me.loadingCoupons.pop();
                if( poppedCoupon == me.getEnteredCoupon() && !me.loadingCoupons.length){
                    me.render();
                    if ( me.order.get('validity').coupon == false ){
                        core.utils.trackingLogger.logError("tracking:checkout_error_field_coupon", poppedCoupon);
                        me.focusCoupon();
                    }
                }
                me.trigger("couponValidated");
            });
        });

        this.loadingCoupons = [];
        this.validateCouponDebounced = _.debounce(_.bind(me.validateCoupon, me), 2000);

        this.order.on("payWithPaypal", _.bind(this.payWithPaypal, this));
        core.views.Payment.__super__.initialize.call(this);
    },

    getEnteredCoupon: function(){
        return this.$(".order_form_coupon_code").val();
    },


    /**
    * Focus the coupon field
    */
    focusCoupon: function(){
        var couponField = this.$('.order_form_coupon_code');
        couponField.focus();
        var oldVal = couponField.val();
        couponField.val('');
        couponField.val(oldVal); //moves the caret to the end of the input
    },

    render: function(){
        var me = this;
        core.views.Payment.__super__.render.call(this); //is this necessary?

        //temporary fix for DHFE-725 until LH-4007 is implemented
        var paypalOpt = _.find(this.options.payment_methods, function(opt){
            return opt.name == "paypal";
        });

        if ( paypalOpt ) {
            this.options.payment_methods = _.filter(this.options.payment_methods, function(opt){
                return opt.name != "credit";
            });
            this.options.payment_methods.push({
                id: paypalOpt.id,
                name: "credit"
            });
        }

        this.renderedTpl = _.template(this.tpl, {
            payment_methods: this.options.payment_methods,
            selected_payment: this.paymentMethod,
            price_details: this.order.get('price_details').viewJSON(),
            validity: this.order.get('validity'),
            coupon: this.order.get('coupon').viewJSON(),
            enteredCoupon: this.enteredCoupon || "",
            canDisplayCoupon: function(){
                return me.paymentMethod.name!="cash";
            }
        });

        this.el.innerHTML = this.renderedTpl;
        this.$el.children().jqTransform(); //doing this here and not in 'plugins' to avoid flickering caused by async rendering
        this.statusDiv = this.$(".order_form_coupon_status");
        this.trigger("render");
    },

    /**
    * Schedule coupon validation
    * @param {Object} evt The event object passed by Backbone
    */
    scheduleCouponValidation: function(evt){
        if(evt.which == 13 || evt.charCode == 13){
            evt.preventDefault(); //disable form submission when pressing enter
        }else{
            if(evt.charCode===0) return; //firefox triggers keypresses for special characters with charCode==0
        }

        this.setStatusLoading();
        var me = this;
        setTimeout(function(){
            //giving time to keypress evt to udpate input value
            me.validateCouponDebounced(evt.target.value);
        });
    },

    /*
    * Validate a coupon code against the backend
    * @param {String} couponValue The coupon value
    */
    validateCoupon: function(couponValue){
        this.enteredCoupon = couponValue;
        this.trigger("validateCoupon", couponValue);
        this.order.set("coupon", {
            code: couponValue
        },{
            silent: true
        });
        this.order.save();

        this.loadingCoupons.push(couponValue);
    },

    /**
    * Update the UI to reflect an "loading" state.
    */
    setStatusLoading: function(){
        this.statusDiv.children().hide();
        this.statusDiv.children(".loading").show();
    },

    /**
    * Update the UI to select a payment method when the user clicks a tab
    * @param {Object} evt The event object passed by Backbone
    */
    selectPaymentMethod: function(evt){
        var $li = $(evt.currentTarget);
        var paymentMethodId = $li.data("paymentMethodId");
        var paymentMethodName = $li.data("paymentMethod");

        this.order.set("payment", {
            method: {
                id: paymentMethodId,
                name: paymentMethodName
            }
        });

        if ( !this.paymentMethod || this.paymentMethod.name != paymentMethodName ) {
            if(paymentMethodName=="cash"){
                this.order.resetCoupon();
                this.enteredCoupon = "";
            }
            this.paymentMethod = {
                id: paymentMethodId,
                name: paymentMethodName
            };
            this.render();
        }
    },

    /**
    * Initiates the paypal payment workflow.
    * @param {Object} payment The payment information data
    */
    payWithPaypal: function(payment){
        var paypal_params = payment.gateway.params[0];
        var return_url = core.utils.formatURL("/order_confirmation/" + this.order.get('id')); //TODO do this better
        var cancel_return_url = window.location.href+"?error=paypal";

        var allParams = _.extend({
            'button_subtype': 'products',
            'return': return_url,
            'cancel_return': cancel_return_url,
            'notify_url': payment.gateway.notify_url,
            'bn': 'PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted'
        }, paypal_params);

        var paypalForm = $("<form/>").attr('action', payment.gateway.url).attr('method', 'post');
        _.each(allParams, function(value, key, list){
            var hiddenInput = $("<input type='hidden'/>").attr('name', key).attr('value', value);
            paypalForm.append(hiddenInput);
        });

        this.$el.append(paypalForm);
        paypalForm[0].submit();
    },

    /**
     * @return {core.views.Payment} The view used to render a Payment
     */
    demo: function() {
        var paymentView = new core.views.Payment({
                "payment_methods": [{"id": "0", "name": "cash"}]
        });
        return paymentView;
    }
});
