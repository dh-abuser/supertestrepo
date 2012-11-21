/**
 * Restaurant List Filter Form
 * 
 */
core.define('core.views.FilterForm', {
    
    extend:     'core.views.Box',
    className:  'FilterForm',

    options: {
        cookieName: 'showFilter',
        implicit_categories: '',
        template:  'Filter/FilterForm.html'
    },

    plugins: {
        'form' : 'jqTransform'
    },

    events: {
        'click form .button'            : 'submit',
        'click input[type=checkbox]'    : 'toggleCheckbox',
        'click .hideshow'               : 'toggleVisibility'
    },

    /**
     * Constructor.
     */
    initialize: function() {
        var me  = this;
        var tpl = this.options.template;
        
        this.optionsCollection = this.options.options || new core.collections.Option();
        this.categoriesCollection = this.options.categories || new core.collections.Category();
        
        core.utils.getTemplate(tpl, function(tpl) {
            me.render(tpl);
        });
        
        core.views.FilterForm.__super__.initialize.call(this);
    },

    /**
    * Get selected (checked) input[type=checkbox]
    * @returns {Object} Selected items
    */
    getSelected: function() {
        var selected = [], categories = [], options = [];

        selected = this.$("input[type=checkbox]:checked");

        _(selected).each(function(filter,i) {
            if ($(filter).hasClass('category'))  {
                categories.push(filter.name);
            } else if (!$(filter).hasClass('filter-category-select-all')) {
                options.push(filter.name);
            }
        });

        return {categories: categories, options: options};

    },

    /**
    * Builds a new filter URL
    * @returns {String} A string representation of URL
    */
    buildUrl: function() {
        var selected, params = {};

        selected = this.getSelected();
        if (selected.categories) {
            params['categories'] = selected.categories;
        }

        _.each(selected.options, function(option) {
            params[option] = "true";
        });

        pathname = window.location.pathname;
        if(this.options.implicit_categories) {
            parts = pathname.split('/');
            parts_len = parts.length

            for(var i = 0; i < this.options.implicit_categories.length; i++) {
                category_part = _.lastIndexOf(parts, this.options.implicit_categories[i]);
                if(category_part != -1) {
                    parts.splice(category_part, 1);
                }
            }

            /* If we haven't popped anything then there is some other category
             * indicator than needs to be removed
             */
            if(parts_len == parts.length) {
                if(parts[-1] == '') {
                    parts.splice(-2, 1)
                } else {
                    parts.pop()
                }
            }
            pathname = parts.join('/');
        }


        url = core.utils.buildUrl(params, null, pathname);

        return url;
    },

    /*
    * Toggles select all / option checkbox(es)
    *
    */ 
    toggleCheckbox: function(e) {
        if($(e.target).hasClass('filter-category-select-all')) {
            $("input.category").prop("checked", false).trigger('change');
        } else if($(e.target).hasClass('category')){
            $('.filter-category-select-all').prop("checked", false).trigger('change');
        }
    },

    /**
    * Form Submit Event Handler
    *
    */    
    submit: function() {
        var url = this.buildUrl();
        window.location.href = url;
    },

    /**
    * Renders the view/template and injects in to the dom
    * @param {String} tpl An HTML template
    */
    render: function(tpl) {
        var me = this;

        me.template = _.template(tpl,{
            categories: me.categoriesCollection.toJSON(),
            options:    me.optionsCollection.toJSON()
        });

        me.$el.html(this.template);
        this.prePopulateFromUrlParams();
        this.setVisibilityBasedOnCookie();

        core.views.Form.__super__.render.call(this);

    },
    
    prePopulateFromUrlParams: function() {
        var params,
            categories,
            me = this;

        params = core.utils.getUrlParams();
        // Grab the categories
        categories  = (params.categories || '').split(',');

        if(this.options.implicit_categories) {
            if(_.intersection(categories, this.options.implicit_categories).length <= 0) {
                if(categories[0] == '') { categories.pop(); }
                categories = _.union(categories, this.options.implicit_categories);
            }
        }

        // Delete categories from params hash
        delete params.categories;

        // Check selected categories
        if(categories.length === 1 && (categories[0] === 'all' || categories[0] === '')) {
           me.$(".filter-category-select-all").prop('checked', true);
        } else {
            _.each(categories, function(category) {
                me.$("input[name=" + category + "]").prop("checked", true);
            });
        }

        // Anything left is assumed to be an option
        _.each(params, function(value, option) {
            me.$("input[name=" + option + "]").prop("checked", true);
        });
        
    },
    
    /**
     * Toggle Filter Visibility based on value of cookie
     */
    setVisibilityBasedOnCookie: function() {
        if ($.cookie(this.options.cookieName) === 'false') {
            this.hide(true);
        } else {
            this.show(true);
        }
    },

    /**
     * Toggle Filter Visibility
     */
    toggleVisibility: function() {
        if (this.$el.hasClass('hidden')) {
            this.show();
        } else {
            this.hide();
        }
    },

    /**
     * Show Filter Widget
     * @param {Bool} noFx Suppress/Skip FX/Animation
     * TODO: Move to core.View - implement noFx as property?
     */
    show: function(noFx) {
        var me = this;
        me.isFixable = true;
        
        if (!noFx) {
           me.$('.body-filter').slideDown(function() {
               me.$el.removeClass('hidden');
               me.$('.label').text(jsGetText('hide_filter'));
               $.cookie(me.options.cookieName, 'true');
           });
        } else {
           me.$el.removeClass('hidden');
           me.$('body-filter').show();
           me.$('.label').text(jsGetText('hide_filter'));
        }
    },

    /**
     * Hide Filter Widget
     * @param {Bool} noFx Suppress/Skip FX/Animation
     * TODO: Move to core.View - implement noFx as property?     
     */
    hide: function(noFx) {
       var me = this;
       me.isFixable = false;

       if (!noFx) {
           me.$('.body-filter').slideUp(function() {
               me.$el.addClass('hidden');
               me.$('.label').text(jsGetText('show_filter'));
               $.cookie(me.options.cookieName, 'false');
           });
       } else {
           me.$el.addClass('hidden');
           me.$('.body-filter').hide();
           me.$('.label').text(jsGetText('show_filter'));
       }
       $(document).scroll(); //udpate view and hide filter
    },

    /**
    * Demo code
    */
    demo: function() {

        var categories = new core.collections.Category([
            {name: 'pizza'},
            {name: 'fast-food'},
            {name: 'asian'},
            {name: 'sushi'},
            {name: 'indian'},
            {name: 'mediterran'},
            {name: 'oriental'},
            {name: 'gourmet'},
            {name: 'international'}
        ]);
        
        var options = new core.collections.Option([
            {name: 'online_payment'},
            {name: 'box'}
        ]);
        
        var form = new core.views.FilterForm({
            categories: categories,
            options: options
        });

        return form;
    }
});