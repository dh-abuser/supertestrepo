core.define('core.views.ErrorLightbox', {
    extend : 'core.views.Lightbox',

    template: 'Lightbox/small.html',

    events : {
        "click .top-box .close-icon" : "hide",
        "click .reload": "reload"
    },

    initialize: function() {
        core.views.ErrorLightbox.__super__.initialize.call(this);
        this.on('render', _.bind(this.update, this));
    },

    update: function() {
        this.setTitle(jsGetText('global_error_sorry'));
        this.setContent([
            $('<p>').text(jsGetText('global_ajax_error')).html(),
            $('<p>').html($('<a class="reload">').attr('href', window.location.href).text(jsGetText('page_reload'))).html()
        ].join(' '));
    },

    reload: function() {
        window.location.reload();
        return false;
    }
});
