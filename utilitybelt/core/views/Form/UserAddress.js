/*
 * Form for editing User Address
 *
 * Example:
 *
 *     var form = new core.views.UserAddressForm({ id: 'a2', user_id: 'a1' });
 *     form.renderTo($('#my_container'));
 *
 * @param {String} user_id User ID
 * @param {String} id Address ID
 */

core.define('core.views.UserAddressForm', {
    extend: 'core.views.Form',
    className: 'UserAddressForm',
    template: '',
    user_id: null,
    model: null,

    events: {
        "submit form": "formValidate",
        "click .submit": "formValidate",
        "click a.back": "onBackLinkClick"
    },

    plugins: {
        'form': 'jqTransform'
    },
    
    /**
     * Constructor
     */
    initialize: function(){
        var me = this;
        this.user_id = this.options.user_id;
        this.id = this.options.id;

        this.record = this.options.record;

        this.model = this.options.model || new core.models.Address({ user_id: this.user_id, id: this.id });

        core.utils.getTemplate('UserAddress/UserAddressForm.html', function(tpl) {
            me.render(tpl);
        });
    },

    /*
     * Render the widget using the template
     */
    render: function(tpl){
        var me = this;
        me.template = _.template(tpl);
        me.$el.append(me.template);
        me.form = me.$el.find('form');
        me.clearInvalidSimple();
        me.loadAddressData();
        core.views.UserAddressForm.__super__.render.call(this);
    },

    /*
     * Populate with the address data
     */
    loadAddressData: function(){
        var me = this;
        if (this.record) {
            me.model = this.record;
            me.setValues(this.record);
        }
        else if (this.options.id) {
            this.model.fetch({ success: function(mdl) {
                me.setValues(mdl);
            } });
        }
    },

    /*
     * Runs when user clicks on a "Back" link
     */
    onBackLinkClick: function() {
        if (this.options && this.options.onBackLinkClick)
            this.options.onBackLinkClick();
    },

    /*
     * Demo code
     */
    demo: function() {
        var form = new core.views.UserAddressForm({ id: 1, user_id: 1 });
        return form;
    }
});
