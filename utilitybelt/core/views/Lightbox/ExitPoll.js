/**
 * Lightbox for Exit Poll
 *
 *     var cb = new core.views.ExitPollLightbox();
 *     cb.show();
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.ExitPollLightbox', {

    extend : 'core.views.Lightbox',
    template: 'Lightbox/small.html',

    initialize: function(options) {
        this.on('render', function() {
            this.options['hide'] = _.bind(this.hide, this);
            this.addItem(core.views.ExitPollForm, this.options);
            this.setTitle(jsGetText('poll_title'));
        });
        core.views.ExitPollLightbox.__super__.initialize.call(this);
    }
});
