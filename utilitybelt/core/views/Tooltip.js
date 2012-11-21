/**
 * Tooltip
 * @requires core.View
 */
core.define('core.views.Tooltip', {

    extend: 'core.View',

    className: "Tooltip",

    /**
     * Define handlers for mouse interactions (click, mouseenter, mouseleave)
     */
    setHandlers: function() {
        var out;
        this.options.anchor.mouseleave( function() {
            out = setTimeout( function() {
                $el.fadeOut(600);
            }, 300);
        });

        $(document).click( function() {
            $el.fadeOut(600);
        });

        $el.mouseenter( function(event) {
            clearTimeout(out);
            event.stopPropagation();
            $el.mouseleave( function(event) {
                $el.fadeOut(600);
            });
        });

    },

    /*
     * Adjust Tooltip position according to the anchor
     * @param {Object} anchor Anchor element (for example, link which should be clicked to display the tooltip)
     */
    adjustPosition: function(anchor) {
        var pos = anchor.position(), // offset doesn't calculate position correctly
            height = anchor.height(),
            width = anchor.width();
        $el.css({ "left": (pos.left) - (width/2 - 50) + "px", "top": pos.top + height - 5 + "px", position: 'absolute', 'z-index': 999999 });
    },

    /*
     * @constructor
     */
    initialize: function() {
        $el = this.el;

        this.adjustPosition(this.options.anchor);

        this.setHandlers();

        $el.fadeToggle(600);

        if (this.options.click_event)
            this.options.click_event.stopPropagation();
    }
});
