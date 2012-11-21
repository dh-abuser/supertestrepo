/**
 * Lightbox with the "password forgotten" form
 *
 * Examples:
 *
 *     var lb = new core.views.PasswordLightbox();
 *     lb.show();
 *
 * @extends core.views.Lightbox
 */
core.define('core.views.PasswordLightbox', {
    extend: 'core.views.Lightbox',
    template: 'Lightbox/base.html',


    /**
     * Constructor.
     * @method initialize
     * @constructor
     * @param {Object} options Options passed to the login form view
     */
    initialize: function(options) {
        this.model = options.user;
        var lb = this;
        this.on('render', function() {
            this.addItem(core.views.PasswordForm, this.options);
            this.formView = this.getItem();
            this.formView.on("hide",function(){
                lb.hide();
            });
        });
        core.views.LoginLightbox.__super__.initialize.call(this);
    },

    /**
     * Demo code.
     */
    demo: function() {
        var $result = $('<a class="button">Click Me</a>')
        .click(function() {
            var lb = new core.views.PasswordLightbox({ title: jsGetText('change_details') });
            lb.show();
        });
        return $result;
    }
});
