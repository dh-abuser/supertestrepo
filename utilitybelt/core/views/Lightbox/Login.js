/**
 * Lightbox with the Login Form inside
 *
 * Examples:
 *
 *     var lb = new core.views.LoginLightbox({ title: jsGetText('login') });
 *     lb.show();
 *
 * @extends core.views.Lightbox
 */
core.define('core.views.LoginLightbox', {
    extend: 'core.views.Lightbox',
    template: 'Lightbox/small.html',

    /**
     * Constructor.
     * @method initialize
     * @constructor
     * @param {Object} options Options passed to the login form view
     */
    initialize: function(options) {
        this.model = options.user || new core.models.User();
        this.options.model = this.model;
        this.model.on('authorize:grant', _.bind(this.hide, this));
        this.on('render', function() {
            var lb = this;
            this.addItem(core.views.LoginForm, this.options);
        });
        core.views.LoginLightbox.__super__.initialize.call(this);
    },

    /**
     * Demo code.
     */
    demo: function() {
        var $result = $('<a class="button">Click Me</a>')
        .click(function() {
            var lb = new core.views.LoginLightbox({ title: jsGetText('login_title') });
            lb.show();
        });
        return $result;
    }
});
