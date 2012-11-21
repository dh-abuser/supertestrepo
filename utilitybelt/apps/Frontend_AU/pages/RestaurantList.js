/**
 * Restaurant list page.
 *
 * @handle authorize:grant Reloads the page
 */
core.define('app.RestaurantList', {
    extend : 'app.Page',

    events : {
    },

    plugins : {
    },

    options : {
        search_closeable: true
    },

    /**
     * Initializes Active Address widget.
     *
     * @handle authorize:grant Reloads the page on successful login
     */
    initialize : function() {
        var me = this;
        this.activeAddress = new core.views.ActiveAddress({
            el: 'section.activeAddress',
            marginTarget: 'section.filter, .landing_page',
            closeable: this.options.search_closeable,
            activeAddress: core.runtime.fetch('active_address', true)
        });
        
        this.filter = new core.views.FilterForm({
            categories: new core.collections.Category([
                {name: 'thai'},
                {name: 'pizza'},
                {name: 'indian'},
                {name: 'chinese'},
                {name: 'italian'},
                {name: 'asian'},
                {name: 'seafood'},
                {name: 'burgers-and-grill'},
                {name: 'dietary-options'},
                {name: 'lebanese-and-turkish'},
                {name: 'japanese-and-sushi'},
                {name: 'other'}
            ]),
            implicit_categories: this.options.implicit_categories,
            options: new core.collections.Option([
                    {name: 'online_payment'},
                    {name: 'box'}
            ]),
            el: 'section.filter',
            fixable: {
                marginTop: '0px', //let the filter back stick to the top when scrolling
                hooks: {
                    scrollingStart: function() {
                        var $zipBox = $('.search_placeholder .zipbox');
                        var zipBoxHeight = $zipBox.outerHeight() + 20;

                        this.$el.css('z-index', 1);
                        this.initialMarginTop = '';

                        if ($zipBox.is(':hidden')) {
                            this.offsetTop = this.initialOffsetTop;
                        } else {
                            this.offsetTop = this.initialOffsetTop + zipBoxHeight;
                        }
                        this.$('.filter-form-wrapper').removeClass("margin-top"); //no top-margin when sticking to the top
                    },
                    scrollPositionDocked: function() {
                        this.$el.css('z-index', 0);
                        this.$('.filter-form-wrapper').addClass("margin-top");
                    }
                }
            }
        });

        this.activeAddress.locationSearchWidget.$el.addClass('search-results');
        
        this.options.user.on('authorize:grant', function(user, token) {
            window.location.reload();
        });

        app.RestaurantList.__super__.initialize.call(this);
    }
});
