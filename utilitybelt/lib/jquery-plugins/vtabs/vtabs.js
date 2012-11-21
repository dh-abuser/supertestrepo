/**
 *
 * vtabs
 * Simple vertical tabs
 * @param {String} selectClass CSS class for selected tabs
 * @param {String} panelSelector jQuery selector for panel
 *
*/
(function($) {

    function vtabs(element, options) {

        var defaults = {
            selectClass: 'select',
            tabSelector: 'li',
            tabHrefAttr: 'href',
            panelSelector: '.vertical-tabs-panels > div'
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.setPanels();
        }

        plugin.setPanels = function() {

            with (this.settings) {
              
                $element.on('click', function(event) {

                    $tab = $(event.target).parent(tabSelector);

                    var selector = $tab.find('a').attr(tabHrefAttr);

                    if (selector) {
                        $(tabSelector, element).removeClass(selectClass);
                        if (selector.indexOf('all') > 0)
                            $(panelSelector).show();
                        else {
                            $(panelSelector).hide();
                            $(selector).show();
                        }
                        $tab.addClass(selectClass);
                    }
                    

                    return false;

                } );

            }
        }

        plugin.init();

    }

    $.fn.vtabs = function(options) {

        return this.each(function() {
            var plugin = new vtabs(this, options);
        });    

    }

})(jQuery);
