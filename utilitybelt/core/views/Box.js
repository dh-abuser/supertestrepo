/**
 * Basic Box with the configurable header, footer, and content
 *
 * Example:
 *
 *     var bb = new core.views.Box({ title: 'Some awesome title', content: 'Awesomest content', el: $('#box-container') });
 *     bb.show();
 *
 * @title Basic Box
 * @param {String} title Title
 * @param {String} content Content
 * @param {String} template Path to template
 * @param {Object or Boolean} If truthy, the box will be fixed to te top of the page when the users scrolls past it.
 *                            If it is an object, additional params can specify the fixable behavior. See initFixablePosition().
 */
core.define('core.views.Box', {

    extend: 'core.View',

    className: "Box",

    template: 'Box/base.html',

    /**
     * Initialize the widget
     * @constructor
     */
    initialize: function() {

        var template = this.options.template || this.template;

        var me = this;
        core.utils.getTemplate(template, function(tpl) {
            me.template = tpl;
            me.render(tpl);
            if (me.options.fixable) {
                me.initFixablePosition(me.options.fixable);
            }
        });
    },

    render: function(tpl) {
        tpl = tpl || this.template;
        this.el = _.template(tpl)(this.options.renderData);
        this.appendElement(this.el);

        var title = this.title || this.options.title || this.$el.attr('header');
        if (title /*&& $('.title-container', this.$el).length < 1*/) {
            this.setTitle(title);
        }

        var content = this.options.content;
        if (content) {
            this.setContent(content);
        }

        core.views.Box.__super__.render.call(this);
    },

    /**
     * Method for appending the final mark-up to DOM. By default, adds it to the this.el
     * Should be overriden for Lightbox-alike widgets (which render themself to the <body>).
     */
    appendElement: function(el) {
        this.$el.empty().append(el);
    },

    /**
     * Set title for the Lightbox
     * @param {String} title Lightbox Title
     */
    setTitle: function(title) {
        this.$('.title-container').html(title);
    },

    /**
     * Set content for the Lightbox
     * @param {String} content Lightbox Content
     */
    setContent: function(content) {
        this.getBody().html(content);
    },

    /*
     * Returns body element
     * @returns jQuery
     */
    getBody: function() {
        var body = this.$('.body-box');
        if (body.children("div").length > 0){
            return this.$('.body-box').children().first();
        } else {
            return body;
        }
    },

    /*
     * Adds link to title container and return its element
     * @returns jQuery
     */
    addTitleLink: function(html) {
        var $title_link = this.$('.top-box .title-link');
        return $title_link.append(html);
    },

    /**
     * Initialize a part of the view which can change CSS positioning to "fixed" if the user scrolls past its top offset
     * @param {Object} opts The options for the fixable behavior:
     *                          hideEl {String} [optional] Selector for an element which will be hidden when the box goes to fixed position
     *                          marginTop {Integer} [optional] The margin-top the box should have when in fixed position
     */
    initFixablePosition: function(opts) {
        var me = this;
        var $fixable = this.$el;

        if (!$fixable || $fixable.length <= 0)
            return;

        var hideableSel = opts.hideEl;
        var hideable;
        if (hideableSel) {
            hideable = $(hideableSel);
        }

        this.initialOffsetTop = $fixable.offset().top;
        this.offsetTop = $fixable.offset().top;
        this.initialMarginTop = $fixable.css('margin-top');

        if ($fixable[0].style.width) {
            //if there's inline style defined width, remember it so we can restore it
            $fixable.data('origWidth', $fixable[0].style.width);
        }
        var $placeholder = $("<div/>"); //takes the place of $fixable when scrolling so the layout is unaltered
        $placeholder.insertAfter($fixable);

        core.utils.Dom.scrollingEl.on("scroll", function(evt) {
            if (_.has(opts, "hooks") && _.has(opts.hooks, "scrollingStart")) {
                if (_.isFunction(opts.hooks.scrollingStart)) {
                    opts.hooks.scrollingStart.call(me);
                }
            }

            if ( !me.isFixable && !me.options.fixable ) return;

            var scrollTop = core.utils.Dom.scrollTop();
            
            //if the user scrolled past the fixable side, add "fixed-top" class, otherwise remove it.
            if (scrollTop > me.offsetTop) {
                var fixableWidth = $fixable.width();
                var fixableHeight = $fixable.height();
                $placeholder.css({
                    width: fixableWidth,
                    height: fixableHeight,
                    display: 'block'
                });
                $fixable.css("width", fixableWidth);
                $fixable.addClass("fixed-top");
                opts.marginTop && $fixable.css('margin-top', opts.marginTop);
                if(hideable){
                    hideable.css({
                        visibility: "hidden"
                    });
                }
            } else {
                if ($fixable.data('origWidth')) {
                    $fixable.css("width", $fixable.data('origWidth'));
                } else {
                    $fixable.css("width", "");
                }
                $fixable.removeClass("fixed-top");
                opts.marginTop && $fixable.css('margin-top', me.initialMarginTop);
                $placeholder.css({
                    display: 'none'
                });
                if(hideable){
                    hideable.css({
                        visibility: "visible"
                    });
                }   
                if (_.has(opts, "hooks") && _.has(opts.hooks, "scrollPositionDocked")) {             
                    if (_.isFunction(opts.hooks.scrollPositionDocked)) {
                        opts.hooks.scrollPositionDocked.call(me);
                    }
                }
            }
        });
        core.utils.Dom.scrollingEl.trigger("scroll"); //init the layout: restores $fixable's position if page is refreshed after scrolling
    },

    demo: function() {
        var bb = new core.views.Box({
            title: 'Box title'
        });
        return bb;
    }
});
    