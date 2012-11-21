core.define('app.Confirm', {
    extend: 'app.Page',

    initialize: function() {
        var order = new core.models.Order(lh_order_data);
        this.options.user.on('authorize:grant', function(user, token) {
            window.location.href = core.utils.formatURL('/');
        });

        var confirmationView = new core.views.Confirmation({
            order: order,
            exit_poll: lh_data['exit_poll'],
            is_new_customer: lh_data['is_new_customer'],
            el: '.OrderStatusHero'
        });

        app.Confirm.__super__.initialize.call(this);
    }
});
