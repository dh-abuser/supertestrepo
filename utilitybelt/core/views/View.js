/**
 * Basic core View, all views (widgets) should extend it
 * @param {String} template Template code
 */
core.define('core.View', {

    extend: 'Backbone.View',

    /*
     * Plugins to be bound to the view after rendering.
     * Describe plugins like this:
     *  selector: [plugin name, opt1, opt2, ...]
     * Options will be passed to the plugin function with apply().
     */
    plugins: {},
    children: [],

    /**
     * Runs on widget's render, triggers 'render' event
     */
    render: function() {

        this.delegateEvents();

        if (this.options && this.options.events) {
            this.delegateEvents(_.extend(this.events, this.options.events));
        }

        var me = this;
        me.rendered = true;
        setTimeout( function() {
            me.trigger('render');
            me.bindPlugins();
        }, 1);
        return this;
    },

    /*
     * Renders widget to specified cotainer
     * @param {jQuery} ct Jquery container to render to
     */
    renderTo: function(ct) {
        var me = this;
        this.on('render', function() {
            ct.empty().append(me.$el);
        });
    },


    /**
     * Binds the plugins to the view using the plugins property.
     * The property has to describe which element, which plugin and how to attach it:
     *   selector1: [plugin1, opt1, opt2, ...],
     *   selector2: [plugin2, opt3, opt4, ...]
     *
     * Option can be both primitive types and callbacks:
     * 
     *   'input': [ 'autocomplete', { 
     *       'source': 'suggestLocation', // will be bind to suggestLocation method of the View
     *       'minLength': 2
     *   } ]
     *
     * With no options, the array can be omitted:
     *   selector1: plugin1
     *
     * The plugin is first looked up in the view itself, then in $.fn,
     * enabling overwritting for complex config.
     */
    bindPlugins: function() {
        var me = this;
        for (var s in me.plugins) {
            var plugin = me.plugins[s],
                opts = [];
            if (typeof plugin == 'object') {
                opts = plugin.slice(1);
                _.each(opts, function(opt) {
                    for (var key in opt) {
                        var fn = opt[key];
                        if (me[fn])
                            opt[key] = _.bind(me[fn], me);
                    };
                })
                plugin = plugin[0];
            }
            var fn = plugin in me ? me[plugin] : $.fn[plugin];
            fn.apply(me.$el.find(s), opts);
        }
    },

    /**
     * Adds an instance of the "type" widget into the body (container returned by the getBody() method)
     * Keeps a reference to the added item in the children property.
     * @param {Class} type Class name which should be added
     * @param {Object} config Class config options
     * @returns added element
     */
    addItem: function(type, config) {
        if (this.getBody) {
            var $body = this.getBody();
            var el = 'cid' in config ? config : new type(config);
            this.children.push(el);
            $body.append(el.$el);
            return el;
        }
    },

    /**
     * Returns the last of the view children.
     * TODO handle multiple children.
     *
     * FIXME somehow, in the UB_docs, a view is added twice for a box.
     * Apparently, the good reference (which has its markup in the DOM) is the last one.
     *
     * @return {Object} The last added child
     */
    getItem: function() {
        return this.children[this.children.length - 1];
    },

    demo: function() {
       return $('<div><p>See <a href="#core.views.UserAddressList">core.views.UserAddressList</a></p></div>');
    }
});
