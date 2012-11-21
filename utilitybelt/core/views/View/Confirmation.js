/**
 * View for displaying the confirmation message and graphics on the order confirmation page.
 * Takes care of finalizing the order if it's made through paypal.
 *
 * Example:
 *
 *     var confirmationView = new core.views.Confirmation();
 * 
 */
core.define('core.views.Confirmation', {
    extend: 'core.View',
    className: 'Confirmation',
    options: {
        POLLING_TIMEOUT_MS: 120000 
    },

    /**
    * @param {core.models.Order} options.order The order model
    */
    initialize: function(options) {
        var me = this;
        this.order = options.order;
        this.exit_poll = options.exit_poll;

        this.handleOrderStatus(); // start from initial state, handle it
        core.views.Confirmation.__super__.initialize.call(this);
    },

    /*
    * Update the view based upon the current status of the associated order model
    */
    handleOrderStatus: function(){
        var statusStr = this.order.get('status');
        
        this.showExitPoll();
        
        if (statusStr == "created") {
            this.handleStatusCreated();
        } else if (statusStr == "progress") {
            this.handleStatusProgress();
        } else if (statusStr == "success") {
            this.handleStatusSuccess();
        } else if (statusStr == "failed") {
            this.handleStatusFailed();
        }
    },
    
    /*
     * show an exit poll regarding the order status
     */
    showExitPoll: function(){
        //show exit poll only if new user and the order page is shown
        //for the 1st time (was not refreshed in the browser)
        if (this.options['is_new_customer'] && !core.runtime.has('exit_poll')){
            var deliveryAddress = this.order.get('delivery_address').get('address');
            var exitPollCollection = new core.collections.ExitPoll(this.options['exit_poll']);
            
            var exitPollView = new core.views.ExitPollLightbox({
                collection: exitPollCollection, 
                deliveryAddress: deliveryAddress});
            
            exitPollView.show();
        };  
    },
    
    handleStatusCreated: function(){
        var order = this.order;
        this.setVisibleClass("progress");
        if (order.get('payment').isPaypal()) { //this is always the case ATM
            if (!this.doPaymentCalled) {
                order.set({'operation': 'do_payment'});
                order.save({}, {
                    success: _.bind(this.handleOrderStatus, this)
                });
                this.doPaymentCalled = true;
            } else {
                this.handleStatusProgress();
            }
        }
    },

    /*
    * Poll every POLLING_TIMEOUT_MS ms to update the order status.
    */
    handleStatusProgress: function(){
        var me = this;
        this.setVisibleClass("progress");
        setTimeout(
            function(){
                me.order.fetch({
                    success: function(){
                        me.handleOrderStatus();
                    }
                })
            }
        , this.options.POLLING_TIMEOUT_MS);
    },

    handleStatusSuccess: function(){
        this.setVisibleClass("success");
    },

    handleStatusFailed: function(){
        this.setVisibleClass("failed");
    },

    /*
    * Sets one of the status div's to visible and hides the others.
    * @param {String} visibleClass The class of the div to be displayed ("success", "progress" or "failed")
    */
    setVisibleClass: function(visibleClass){
        this.$(">div").addClass("hide");
        this.$(">."+visibleClass).removeClass("hide");
    }
});
