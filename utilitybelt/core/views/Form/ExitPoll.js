/**
 * Form for Exit Poll
 *
 * Example:
 *
 *     var form = new core.views.ExitPollForm({ model: theExitPoll });
 *     form.renderTo($('#my_container'));
 *
 * @param {Object} model An instance of an Exit Poll model
 */
core.define('core.views.ExitPollForm', {
    extend: 'core.views.Form',
    className: 'ExitPollForm',
    options: {
        template: 'ExitPoll/ExitPollForm.html'
    },
    
    events: {
        "click .submit": "submit",
    },
    
    plugins: {
            'form' : 'jqTransform'
    },

    initialize: function(options) {
        var me = this, tpl = this.options.template;
        this.collection = this.options.collection || new core.collections.ExitPoll();
        
        var exit_poll_obj = this.collection.getShuffledOptions();
        core.utils.getTemplate(this.options.template, function(tpl) {
            me.template = _.template(tpl, {exit_poll: exit_poll_obj});
            me.render();
        });
    },

    /**
     * Renders the widget using the given template.
     * @param {String} tpl The html template used to render the form
     */
    render: function(tpl) {
        this.$el.html(this.template);
        this.form = this.$('form');
        this.logFirstTimeDisplay();
        
        core.views.ExitPollForm.__super__.render.call(this);
    },
    
    submit: function() {
        var data = this.getValues();
        var correct = this.collection.validate(data);

        if (correct) {
            this.send(data);
        } else {
            this.markInvalid();
        }

        return false;
    },
    
    markInvalid: function(){
        this.$('.error').text(jsGetText('poll_error'));
    },
    
    send: function(data, options){
        this.logSendDisplay();
        //set a cookie to prevent more than 1 instance of the poll
        core.runtime.persist('exit_poll', 'yes');
        this.options.hide(); //hide() method passed from parent lightbox
    },
    
    logFirstTimeDisplay: function(){
        var howManyOptions = this.$('input[type="radio"]').length;
        var locationData = this.options.deliveryAddress.get('suburb') + ',' + this.options.deliveryAddress.get('city');
        core.utils.trackingLogger.log('polls', 'exit_poll_first_find_display', locationData, howManyOptions);
    },
    
    logSendDisplay: function(){
        var howManyOptions = this.$('input[type="radio"]').length;
        var selectedOption = this.$('input[type=radio]:checked').val();
        core.utils.trackingLogger.log('polls', 'exit_poll_first_find_submit', selectedOption, howManyOptions);
    }
});
