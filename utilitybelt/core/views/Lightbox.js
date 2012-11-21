/**
 * Basic Lightbox with the title, close icon, and content
 *
 * Example:
 *
 *     var lb = new core.views.Lightbox({ title: 'Some awesome title', content: 'Awesomest content' });
 *     lb.show();
 *
 * @title Basic Lightbox
 * @param {String} title Title
 * @param {String} content Content
 * @param {Number} x X coordinate on the screen
 * @param {Number} y Y coordinate on the screen
 * @param {String} tempate Path to template
 */
core.define('core.views.Lightbox', {

    extend: 'core.views.Box',

    className: "Lightbox",

    template: 'Lightbox/base.html',

    templateCloseButton : 'Lightbox/close.html',

    __closeButton : null,

    events: {
        "click .top-box .close-icon" : "hide",
        "click .closeLB.button" : "hide"
    },
    
    options: {
        closeButton: false,
        modal: false,
        position: "absolute",
        blanketId: "dark_blanket",
        blanketClickToClose: false,
        fx: true
    },

    /**
     * Init blanket layer which cover the page to prevent interaction when Lightbox is modal.
     * Click on blanket close the Lightbox.
     */
    initBlanket: function() {
        var doc = $(document);
        if (!this.blanket) {
            this.blanket = $(document.createElement("div")).attr({
                id : this.options.blanketId
            }).hide();
            if (this.options.blanketClickToClose){
                this.blanket.bind('click', _.bind(this.hide, this));
            }

            this.blanket.appendTo(document.body);
        }
    },

    /**
     * Hide Lightbox, destroy its DOM structure, hide blanket
     */
    hide: function() {
        this.trigger('hide');
        if (this.options.fx) {
            var me = this;
            this.$el.stop().fadeOut('fast', function() {
                me.remove();
            });
            if (this.isModal() && this.blanket) {
                this.blanket.stop().fadeOut('fast', function() {
                    $(this).remove();
                    me.blanket = null;
                });
            }
        }
        else {
            // remove from DOM, to prevent flooding
            this.remove();
            if (this.isModal() && this.blanket) {
                this.blanket.remove();
                this.blanket = null;
            }
        }
    },

    /**
     * Init Lightbox position and layout properties
     */
    initPosition: function() {
        this.$el.css({
            position : this.options.position || 'absolute',
            'margin': '0px'
        });

        this.body = this.getBody();

        if(this.options.height) {
            this.body.height(this.options.height);
            this.body.css({
                'overflow-x': 'hidden',
                'overflow-y': 'auto'
            });
        }

        var pos;

        if (this.options.x && this.options.y) {
            pos = {
                left : this.options.x,
                top : this.options.y
            };
        } else {
            //center the lightbox
            pos = this._getCenteredPosition();
        }

        pos.top += core.utils.Dom.scrollTop(); //Fit the lightbox vertically into the viewport if it has been scrolled
        
        this.setPosition(pos);
    },

    /**
     * Initialize the widget
     * @constructor
     */
    initialize: function() {
        this.template = this.options.template || this.template;
        var me = this;
        this.on('render', function() {
            me.clearError();
            me.initPosition();
            if (me.options.closeButton){
                me.showCloseButton();
            } else {
                me.hideCloseButton();
            }
            // show view
            if (me.options.fx) {
                me.$el.fadeIn('fast');
            }
            else {
                me.$el.show();
            }
            // show blanket
            if (me.isModal()) {
                me.initBlanket();
                if (me.options.fx)
                    me.blanket.fadeIn('fast');
                else
                    me.blanket.show();
            }
            if (me.options.errorMessage) {
                me.showError(me.options.errorMessage);
            }
        });
        core.utils.getTemplate(this.template, function(tpl) {
            me.template = tpl;
        });
        core.utils.getTemplate(this.templateCloseButton, function(tpl) {
            me.templateCloseButton = _.template(tpl)();
        });
    },

    /**
     * shows the close button
     */
    showCloseButton : function() {
        if (this.__closeButton == null) {
            var body = this.$el.find('.body-box');
            this.__closeButton = $(this.templateCloseButton).clone();
            body.append(this.__closeButton);
        }
        this.options.closeButton = true;
    },
    
    
    /**
     * hides the close button
     */
    hideCloseButton: function(){
        if (this.__closeButton != null) {
            this.__closeButton.remove();
            this.__closeButton = null;
        }
        this.options.closeButton = false;
    },

    appendElement: function(el) {
        this.$el = $(el).appendTo($('body')).hide();
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
     * Check if Lightbox is modal
     * @returns Boolean
     */
    isModal: function() {
        return this.options.modal != false;
    },

    /*
     * Show inline error via .message element
     * @method showError
     */
    showError: function(text) {
        this.options.errorMessage = text;
        this.$('.message').html(text);
    },

    /*
     * Clear error from the .message element
     */
    clearError: function() {
        this.$('.message').html('');
    },

    /**
     * Sets the position of the lightbox
     * @param {Object} position Object with two properties:
     *        {Number}   top: The top offset in px
     *        {Number}   left: The left offset in px
     */
    setPosition: function(position){
        this.$el.css({
            top: position.top,
            left: position.left
        });
    },

    /**
     * Returns true if the lightbox's height is bigger than the viewport's, false otherwise.
     */
    isOverflowing: function(){
        return this.$el.height() > core.utils.Dom.viewHeight();
    },

    /**
     * Returns the coordinates of the lightbox, centered inside the viewport
     */
    _getCenteredPosition: function(){
        return {
            top: 130,
            left: ((core.utils.Dom.viewWidth() - this.$el.outerWidth()) / 2) + core.utils.Dom.scrollLeft()
        };
    },

    /*
     * Center Lightbox
     */
    center: function() {
        var centeredPos = this._getCenteredPosition();
        this.setPosition(centeredPos);
    },

    isVisible: function() {
        return this.$el.is(':visible') || this.$el.is(':animated');
    },

    /*
     * Show Lightbox
     */
    show: function() {
        if (this.isVisible()) {
            return;
        }
        this.__closeButton = null;
        var me = this;
        me.render();
    },

    demo: function() {
        var $result = $('<a class="button">Click Me</a>').click(function() {
            var lb = new core.views.Lightbox({
                title: 'Some awesome title',
                content: 'Awesomest content'
            });
            lb.show();
        });
        return $result;
    }
});
