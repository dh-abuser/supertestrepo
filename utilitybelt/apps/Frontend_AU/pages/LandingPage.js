/**
 * Restaurant list page.
 *
 * @handle authorize:grant Reloads the page
 */
core.define('app.LandingPage', {
    extend : 'app.Page',

    events : {
    },

    plugins : {
    },

    /**
     * Initializes Active Address widget.
     *
     * @handle authorize:grant Reloads the page on successful login
     */
    initialize : function() {

        this.activeAddress = new core.views.ActiveAddress({
            el: 'section.activeAddress',
            marginTarget: '.landing_page',
            closeable: false
        });

        this.activeAddress.showSearchWidget();
        
        this.options.user.on('authorize:grant', function(user, token) {
            window.location.reload();
        });

        app.LandingPage.__super__.initialize.call(this);
        
    }
});
