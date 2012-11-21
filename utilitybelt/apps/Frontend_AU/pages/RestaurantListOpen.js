/**
 * Restaurant list page that has a search widget open.
 *
 * @handle authorize:grant Reloads the page
 */
core.define('app.RestaurantListOpen', {
    extend : 'app.RestaurantList',

    events : {
    },

    plugins : {
    },

    options : {
        search_closeable: false
    },

    /**
     * Initializes Active Address widget.
     *
     * @handle authorize:grant Reloads the page on successful login
     */
    initialize : function() {
        app.RestaurantListOpen.__super__.initialize.call(this);
        this.activeAddress.showSearchWidget();
    }
});
