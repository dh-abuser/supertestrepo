/**
 * View with the list of User Addresses
 *
 * Example:
 *
 *     var list = new core.views.UserAddressList();
 *     list.renderTo($('#some_element'));
 *
 * @param {Collection} collection Collection of core.models.Address
 * @param {Function} openEditWidget Handler to open the widget for model editing
 */
core.define('core.views.UserAddressList', {

    extend: 'core.View',
    className: 'UserAddressList',
    template: '',
//    user_id: null,

    events: {
        'click .edit-icon': 'editAddress',
        'click .delete-icon': 'deleteAddressConfirm',
        'click .user-address li': 'addressEventPropagate'
    },

    /**
     * Constructor, set collection and template
     */
    initialize: function() {

        if (!this.options || !this.options.user_id) {
            throw('User_id must be set');
            return;
        }

        this.collection = this.options.collection || new core.collections.Address();
        this.collection.bindTo(this);
        var me = this;
        core.utils.getTemplate(['UserAddress/UserAddresses.html'], function(tpl) {
            me.template = tpl;
            me.collection.setUrlParams({ user_id: me.options.user_id });
            me.collection.fetch(); // should change url first...
        });

    },

    /**
     * Render widget using the collection and the template
     */
    render: function() {
        var me = this,
            collection = me.collection;

        if (!collection.length) {
            me.onUserListEmpty();
        }
        else {
            var col = collection.toJSON(),
                tpl = _.template(me.template),
                data = { addresses: col };

            data.get_full_address = function(address) { // TODO: create set of global renderers and process them in generic way
                return address.city + ' ' + address.street_name + ' ' + address.street_number;
            };
            me.$el.empty().append(tpl(data));
        }
        core.views.UserAddressList.__super__.render.call(this);
    },

    /**
     * Run when addresses collection is empty
     */
    onUserListEmpty: function() {
        this.$el.empty().append(jsGetText("no_addresses"));
    },

    /**
     * Run when click on "edit user" icon
     */
    editAddress: function(e) {
        var id = e.target.id;
        var rec = this.collection.get(id);
        if (rec && rec.id && this.options.openEditWidget) {
            this.options.openEditWidget({ record: rec, title: jsGetText('edit_address') });
        }
    },

    /**
     * Remove the address from collection and re-render the widget
     */
    deleteAddress: function(id) {
        var rec = this.collection.get(id);
        var me = this;
        rec.destroy({ success: function() {
           me.collection.remove();
           me.render();
        } });
    },

    /**
     * Run when click on "delete user" icon, show small inline "confirmation" dialog
     */
    deleteAddressConfirm: function(e) {
        var id = e.target.id, me = this;
        core.utils.getTemplate(['UserAddress/DeleteConfirm.html'], function(tpl) {
            var html = _.template(tpl);
            var ct = $(e.target).parents('li');
            var confirm_message = ct.hide().after(html).next();
            confirm_message.height(ct.height());
            $('.yes', confirm_message).click(function() {
                ct.show();
                confirm_message.hide();
                me.deleteAddress(id);
            });
            $('.no', confirm_message).click(function() {
                ct.show();
                confirm_message.hide();
            });
        });
    },

    /**
     * Delegates an event on a address DOM element to its inner checkox.
     * @param {Object} e The event
     */
    addressEventPropagate: function(e) {
        var eventType = e.handleObj.type;
        if (!$(e.target).is('input,a'))
            $(e.currentTarget).find('input[type=checkbox]').trigger(eventType);
    },

    demo: function() {
        var list = new core.views.UserAddressList();
        return list;
    }
});
