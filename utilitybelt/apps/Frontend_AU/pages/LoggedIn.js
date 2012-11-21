/**
 * Logged in page.
 *
 * @handle authorize:revoke Reloads the page
 */
core.define('app.LoggedIn', {
    extend : 'app.Page',

    events : {
    },

    plugins : {
    },

    /**
     * Constructor
     *
     * @handle authorize:grant Reloads the page on successful login
     */
    initialize: function() {
        app.LoggedIn.__super__.initialize.call(this);
        this.initWidgets();
        this.options.user.on('authorize:grant authorize:revoke', function(user, token) {
            window.location.reload();
        });
    },

    /**
     * Initialise Location Search widget and register event listeners
     */
    initWidgets: function() {
        var me = this,
            ls = {
                renderToEl : $('.search_placeholder'),
                showCloseButton: false,
                wide: true,
                show: true
            };
        this.locationSearchWidget = new core.views.LocationSearch(ls);

        this.locationSearchWidget.on("locationFound", _.bind(this.locationFound, this));
        this.locationSearchWidget.on("locationNotFound", _.bind(this.showError, this));
    },

    /**
     * Location Found event handler
     */
    locationFound: function(ev) {
        var me = this;
        if (ev && ev.collection) {
            if (ev.collection.length > 1) {
                if (me.multiLocationLB && me.multiLocationLB.isShown()) {
                    return;
                }
                me.multiLocationLB = new core.views.MultipleLocationLightbox({
                    locations: ev.collection,
                    position: "absolute",
                    searchTerm: ev.searchTerm
                });
                me.multiLocationLB.on('location:selected', function(item) {
                    me.multiLocationLB.hide();
                    core.utils.redirectLocation(item);
                });
                me.multiLocationLB.show();
            } else if (ev.collection.length == 1) {
                core.utils.redirectLocation(ev.collection.first());
            }
        }
    },

    /**
     * Show errors
     */
    showError : function() {
        var messageLightbox = new core.views.Lightbox({
            title : jsGetText("search_not_found_title"),
            content : jsGetText("search_not_found_message"),
            template : "Lightbox/small.html"
        });
        var me = this;
        messageLightbox.on("hide", function(){
           me.locationSearchWidget.__disabled = false;
        });
        this.locationSearchWidget.__disabled = true;
        messageLightbox.show();
    }

});
