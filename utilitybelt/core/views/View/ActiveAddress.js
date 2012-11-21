/**
 * Example:
 */
core.define('core.views.ActiveAddress', {
    extend: 'core.View',
    
    events: {
        'click a.change' : 'showSearchWidget'
    },
    
    options: {
        el: 'section.filter',
        searchPlaceholder: '.search_placeholder',
        marginTarget: '.restaurant-count, .landing_page',
        marginClass: 'margin-top-filter',
        changeSelector: 'a.change',
        cookieName: 'active_address',
        closeable: true
    },
    
    /**
     * Constructor
     */
    initialize: function() {
        var me = this;
        this.initLocationSearchWidget();
        this.hideSearchWidget(true);
        if (!this.options.activeAddress) {
            me.showSearchWidget();
        }
    },

    /**
     * Initialise Location Search widget and register event listeners
     */
    initLocationSearchWidget: function() {
        var me = this,
            ls = {
                renderToEl : $(me.options.searchPlaceholder),
                showCloseButton: this.options.closeable
            };
        me.locationSearchWidget = new core.views.LocationSearch(ls);
        me.locationSearchWidget.on("locationFound", this.locationFound);
        me.locationSearchWidget.on("locationNotFound", function(params){
            core.utils.trackingLogger.logError('search_error_nomatch_rlist', params.searchValue);
            me.showError.call(me);
        });
        me.locationSearchWidget.on("locationFetchError", function(){
            me.showError.call(me);
        });
        
        me.locationSearchWidget.on('toggle:hide', function(searchWidget) {
            searchWidget.$el.fadeOut(300, function() {
               me.trigger('toggle:hide:complete');
               $(me.options.marginTarget).removeClass(me.options.marginClass, 300);
               me.$(me.options.changeSelector).fadeIn();
            });
        });

        me.locationSearchWidget.on('toggle:show', function(searchWidget) {
            $(me.options.marginTarget).addClass(me.options.marginClass, 300, function() {
               searchWidget.$el.fadeIn(300, function() {
                   me.trigger('toggle:show:complete');
                   me.$(me.options.changeSelector).fadeOut();
               });
            });
        });
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
                    locations : ev.collection,
                    position : "absolute",
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
     * Show Location Search Widget Wrapper
     */
    showSearchWidget: function(ev) {
        if (ev) {
            ev.preventDefault();
        }
        this.locationSearchWidget.show();
    },

    /**
     * Hide Location Search Widget Wrapper
     */
    hideSearchWidget: function(bypass) {
        if (bypass) {
            this.locationSearchWidget.$el.hide();
            this.trigger('toggle:hide:complete');
        } else {
            this.locationSearchWidget.hide();
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