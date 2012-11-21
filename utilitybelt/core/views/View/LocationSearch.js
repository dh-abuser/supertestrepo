/**
 * Example:
 */
core.define('core.views.LocationSearch', {
    extend: 'core.View',
    className: 'LocationSearch',
    template: ["Search/LocationSearchSingle.html"],
    events: {
        "submit .big_input": "suggestOnEnter",
        'keypress input[name="location"]': 'enableAutosuggest'
    },
    plugins: {
        'form *': 'placeholder',
        'input[name="location"]': [ 'autocomplete', {
            'source': 'suggestLocation',
            'select': 'onSelectSuggestedLocation',
            'minLength': 2,
            'position': { offset: '0 -3' },
            'delay': 300
        } ]
    },

    mixins: ['core.mixins.AutosuggestLocations'],

    options: {
        wide: false,
        placeholder: false,
        bgBlinkColor : '#FFDCA8',
        show: false
    },

    /**
     * used for disabling the search when there is already an error popup shown
     */
    __disabled: false,

    /**
     * fetching the template for search box
     * can be extended later on for two search boxes (e.g. in germany)
     */
    initialize: function() {
        //should be able to fetch the already rendered elements from the page
        var me = this;
        if (!this.options.placeholder) {
            this.options.placeholder = jsGetText("search_input_placeholder");
        }
        core.utils.getTemplate(me.template, function(tpl) {
            //render the template and put in the correct wording
            me.template = _.template(tpl)(me.options);
            me.$el = $(me.template);
            if (me.options.renderToEl) {
                me.renderTo(me.options.renderToEl);
            }
            me.render();
            
            if (!me.options.showCloseButton) {
                me.$('.close').remove();
            } else {
                me.$('.close').click(function() {
                   me.hide();
                });
            }

            me.on("render", function() {
                me.searchInputField = me.$('input[name="location"]');
                me.searchInputField.attr("placeholder", me.options.placeholder);

                if (me.options.show) {
                    me.$el.show();
                }
            });
        });
    },

    getSearchInputField: function() {
        if (!this.searchInputField)
            this.searchInputField = $('input[name="location"]');
        return this.searchInputField;
    },

    /**
     * making the element change it background color
     * @param {Object} elem the jquery element which is affected by the animation
     * @param {Number} maxRun how often should it run
     * @param {Object} startingBackgroundColor the starting background color which it will have it again at the end
     * @param {Number} currentRun current running index
     * @param {String} placeHolderText the placeholder text which is shown inside the input element
     */
    makeBling: function(elem, maxRun, startingBackgroundColor, currentRun) {
        if ( typeof (currentRun) == "undefined") {
            currentRun = 0;
        }
        if (!currentRun) {
            elem.attr("placeholder", "");
        }
        var me = this;
        $(elem).animate({
            "background-color": me.options.bgClinkColor
        }, 200).animate({
            "background-color": startingBackgroundColor
        }, 200, function() {
            if (currentRun < maxRun - 1) {
                me.makeBling(elem, maxRun, startingBackgroundColor, ++currentRun);
            } else {
                //TODO here it could fire an event for ending the whole animation sequence, then it could be more generic
                elem.attr("placeholder", me.options.placeholder);
            }
        });
    },

    onEmptyLocation: function() {
        var me = this;
        this.__disabled = true;
        //TODO currently using the lightbox but will be replaced as soon as we have a real tooltip
        this.tooltip = new core.views.Lightbox({
            modal: false,
            template: "Lightbox/small.html"
        });
        this.tooltip.show();
        this.tooltip.setContent(jsGetText("search_location_hint"));
        this.tooltip.setTitle(jsGetText("search_location_hint_title"));
        setTimeout(function() {
            me.tooltip.hide();
            me.__disabled = false;
        }, 2000);
        var backgroundColor = this.getSearchInputField().css("background-color");
        this.makeBling(this.getSearchInputField(), 3, backgroundColor);
    },

    /**
     * Show Location Search Widget
     *
     */
    show: function() {
        this.trigger('toggle:show', this);
    },

    /**
     * Hide Location Search Widget
     *
     */
    hide: function() {
        this.trigger('toggle:hide', this);
    },

    demo: function() {
        var $placeHolder = $('<div class="zip_code" id="search_placeholder"></div>');
        $placeHolder.appendTo($element);
        var search = new core.views.LocationSearch({
            renderToEl: $('#search_placeholder')
        });
        return $placeHolder;
    }
});
