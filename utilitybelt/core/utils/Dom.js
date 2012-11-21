/**
 * DOM utils
 */
core.utils.Dom = (function(){

    var scrollingEl, scrollOffsetEl;
    //the 'offset' for a scrolling page should be calculated on "body" in webkit, on "html" on other browsers (http://bit.ly/KmLb4F)
    scrollingEl = $(document);

    if($.browser.msie){
        scrollingEl = $(window); // on IE, it should be "window" http://www.quirksmode.org/dom/events/scroll.html
    }
    if($.browser.webkit){
        scrollOffsetEl = $("body");
    }else{
        scrollOffsetEl = $("html");
    }
    
    return {

        scrollingEl: scrollingEl, //the element which should be used to compute the scrolling offsets

        /**
        * Getter/setter for the top scroll offset. If an argument is passed, the method acts as a setter.
        * @param selector A parameter for jQuery() i.e. a selector or DOM node. Scrolls the view port to the corresponding DOM node.
        */
        scrollTop: function(selector) {
            if(selector===undefined){
                //getter
                return scrollOffsetEl.scrollTop();
            }else{
                //setter
                var scrollNode = $(selector);
                scrollOffsetEl.scrollTop(scrollNode.offset().top)
            }
        },

        /**
        * Getter/setter for the left scroll offset. If an argument is passed, the method acts as a setter.
        * @param selector A parameter for jQuery() i.e. a selector or DOM node. Scrolls the view port to the corresponding DOM node.
        */
        scrollLeft: function(selector) {
            if(selector===undefined){
                //getter
                return scrollOffsetEl.scrollLeft();
            }else{
                //setter
                var scrollNode = $(selector);
                scrollOffsetEl.scrollLeft(scrollNode.offset().left)
            }
        },

        /**
        * Returns the viewport's width in pixels (see http://api.jquery.com/width )
        */
        viewWidth : function(){
            return window.innerWidth || document.documentElement.clientWidth;
        },

        /**
        * Returns the viewport's height in pixels (see http://api.jquery.com/height )
        */
        viewHeight : function(){
            return window.innerHeight;
        }
    }
})();