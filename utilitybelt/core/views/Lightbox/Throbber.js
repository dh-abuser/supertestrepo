/**
 * Lightbox for showing the Loading Animation with or without blanket
 *
 * Examples:
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.Throbber', {

    extend: 'core.views.Lightbox',

    template: ["Throbber/Throbber.html"],

    events: {
    },
    /**
     * fadeInTime: fading in time[ms] for the animated image
     * fadeOutTime: fading out time[ms] for the animated image
     * delay: the delay time[ms] for starting the fading in of the animated image
     * the blanket is not affected by this settng, it will be shown immediately
     */
    options: {
        fadeInTime: 250,
        fadeOutTime: 150,
        fadeDelay: 2000,
        blanketId: "dark_blanket",
        auto: true,
        position: "fixed"
    },

    // timer for user callback
    __timerCallback: null,

    initialize: function() {
        var me = this,
            timeout = this.options.fadeDelay;
        this.timer = false;
        if (this.options.auto) {
            $(document).ajaxStop(function(event, xhr, error) {
                clearTimeout(me.timer);
                me.timer = false;
                _.defer(function() {
                    me.hide();
                });
            }).ajaxStart(function(event, xhr, error) {
                me.timer = _.delay(_.bind(me.show, me), timeout);
            });
        }
        core.views.Throbber.__super__.initialize.call(this);
    },

    /**
     * handles the event when the window is resized
     * calls center
     * @param {Object} event includes the me object
     */
    onResize: function(event) {
        event.data.me.center.call(event.data.me);
    },

    initPosition: function() {
        this.center();
    },
    /**
     * calculates the center of the screen for the given image
     */
    center: function() {
        //center the animation picture
        var image = this.getAnimImg();
        image.css({
            left: Math.round(($(window).innerWidth() - image.width() ) / 2) + "px",
            top: Math.round(($(window).innerHeight() - image.height() ) / 2) + "px"
        });
    },
    /**
     * removes the blanket and the animated image
     */
    hide: function() {
        var me = this;
        if (me.__timerCallback) {
            clearTimeout(me.__timerCallback);
        }
        if (!this.isVisible()) {
            return;
        }
        var img = me.getAnimImg();
        img.fadeOut(me.options.fadeOutTime, function() {
            core.views.Throbber.__super__.hide.call(me);
            $(window).off("resize", me.onResize);
        });
    },
    /**
     * fetches the img node inside the template
     */
    getAnimImg: function() {
        return this.$(".throbber");
    },
    /**
     * setting the fading in duration
     */
    setFadeInTime: function(value) {
        if ( typeof value == 'number' && value >= 0) {
            this.options.fadeInTime = value;
        }
    },
    /**
     * setting the fading out duration
     */
    setFadeOutTime: function(value) {
        if ( typeof value == 'number' && value >= 0) {
            this.options.fadeOutTime = value;
        }
    },
    /**
     * setting the delay time to start fading in
     */
    setDelay: function(value) {
        if ( typeof value == 'number' && value >= 0) {
            this.options.delay = value;
        }
    },
    /**
     * setting the url of the image
     */
    setImage: function(url) {
        var image = this.getAnimImg();
        image.attr("src", url);
    },
    /**
     * setting the blanket id
     * currently supported:
     * - dark_blanket
     * - light_blanket
     */
    setBlanketId: function(blanketId) {
        if (blanketId) {
            this.options.blanketId = blanketId;
        }
    },

    /**
     * shows the blanket and starts the timeout using options.delay
     * @see options.delay
     */
    show: function(time, callback) {
        var me = this;
        if (this.isVisible()) {
            return;
        }
        core.views.Throbber.__super__.show.call(me);
        var img = me.getAnimImg();
        $(window).on("resize", {
            "me": me
        }, this.onResize);
        img.fadeIn(me.options.fadeInTime);
        me.center();
        //calling the callback function after a while
        if (_.isFunction(callback) && _.isNumber(time) && time > 0) {
            this.__timerCallback = setTimeout(function() {
                callback();
                me.hide();
            }, time);
        }
    }
});
