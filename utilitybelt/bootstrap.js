
/** utilitybelt.js bootstrap script 
 *  Example usage: 
 *        <script src="/utilitybelt/utilitybelt/bootstrap.js"></script>
 *        <script>
 *            var ub = new ub_loader();   
 *            ub.setup({ mode: '{{ config.JS_MODE }}' });
 *            ub.add({ type: 'jquery', path: 'lib/jquery-plugins/vtabs/vtabs.js', name: 'vtabs', el: '.vertical-tabs', options: { selectClass: 'select', panelSelector: '.vertical-tabs-panels > div' } });
 *            ub.add({ type: 'jqueryUI', name: 'tabs', el: '.tabs' });
 *            ub.add({ type: 'core.widgets.Cart', el: '.shopping-cart' });
 *        </script>
 *  Configuragion options:
 *  @param {String} path Path to utilitybelt.js
 *  @param {String} mode 'DEV' or 'PROD', to swicth between development or production modes
 *  @param {Array} html5shims List of libraries enabling HTML5 features on old browsers 
 *  @param {String} requirejs_path Path to RequireJs library (used as a UB widgets packager)
 *  @param {String} requirejs_mode If set to 'auto', requirejs will be included on set-up, and not when the widget is added
 *  @param {String} jquery_path Path to jQuery
 *  @param {String} jqueryui_path Path to jQueryUI
 *  @param {String} development_config Path to requirejs config used in development
 *  @param {String} production_bundle Path to single minified js bundle used in production
 */

var ub_loader = function() {

    return {

        /** Public configuration */
        conf: { 
            'paths': {
                'global': '/static/utilitybelt/utilitybelt/',
                'requirejs': 'lib/require/require.js',
                'jquery': 'lib/jquery/1.7.1/jquery.min.js',
                'jqueryui': 'lib/jqueryui/1.8.17/jquery-ui.min.js'
            },
            'html5shims': [ /*'lib/html5shiv/html5shiv.js'*/ 'lib/modernizr/2.6.2/modernizr.js', 'lib/selectivizr/1.0.2/selectivizr.js' ],
            'development_config': 'apps/Frontend_AU/config.js',
            'production_bundle': 'main-built' 
        },

        /** UB widgets registry */
        widgets_registry: [],

        /** Libraries registry */
        libs_registry: {},
 
        /** Setup config and enable shims */
        setup: function(conf) {
            for (var field in conf) {
                this.conf[field] = conf[field];
            }
            if (this.conf.requirejs_mode == 'auto') {
                this.add_requirejs();
            }
            if (isOld()) {
                this.inject_js(this.conf.html5shims);
            }
        },

        /** Add library's <script> tag, wait while 'condition' will be true, ping with 'frequency', run 'success' callback if 'condition' is met, 'error' otherwise */
        require_lib: function(config) {
            waitFor(config.condition, config.success, config.error);
        },

        /** Add widget or plugin to the page, right now supported types are jQuery, jQueryUI and utilitybelt widget */
        add: function(conf) {
            if (conf.type == 'jquery' && conf.plugin!='') {
                this.add_jquery_plugin(conf);
            }
            else if (conf.type == 'jqueryUI' && conf.name!='') {
                this.add_jqueryui_plugin(conf);
            }
            else {
                this.add_widget(conf);
            }
        },

        /** Adds requirejs lib on page */
        add_requirejs: function() {
            if (this.conf.mode == 'DEV')
                this.inject_js( [ { 'src': this.conf.paths.requirejs, 'data-main': this.conf.paths.global + this.conf.development_config } ] );
            else 
                this.inject_js( [ { 'src': this.conf.paths.requirejs, 'data-main': this.conf.paths.global + this.conf.production_bundle } ] );
        },

        /** Try to add jQuery plugin */
        add_jquery_plugin: function(plugin_conf) {
            var me = this;
            this.inject_js( [ { 'src': this.conf.paths.jquery } ] );
            this.inject_js( [ { 'src': plugin_conf.path } ] );
            this.require_lib({ 
                condition: function() {
                    return typeof($)!='undefined' && $.fn[plugin_conf.name];
                },
                success: function() {
                    me.apply_plugin($, plugin_conf);
                },
                error: function() {
                    console.error('Cannot initialize the jQuery plugin ', plugin_conf.name);
                }
            });
        },

        /** Try to add jQueryUI plugin */
        add_jqueryui_plugin: function(plugin_conf) {
            var me = this;
            this.inject_js( [ { 'src': this.conf.paths.jquery } ] );
            this.inject_js( [ { 'src': this.conf.paths.jqueryui } ] );
            this.require_lib({ 
                condition: function() {
                    return typeof($)!='undefined' && typeof($.ui)!='undefined';
                },
                success: function() {
                    me.apply_plugin($, plugin_conf);
                },
                error: function() {
                    console.error('Cannot initialize the jQueryUI plugin ', plugin_conf.name);
                }
            });
        },

        /** Apply jQuery or jQueryUI plugin to the selector el with options */
        apply_plugin: function($, conf) {
            $.fn[conf.name].apply($(conf.el), [ conf.options ]);
        },

        /** Try to add UB widget using requirejs config */
        add_widget: function(conf) {
            var me = this;
            me.widgets_registry.push(conf);
            me.add_requirejs();
            this.require_lib({ 
                condition: function() {
                    return typeof(core)!='undefined' && core.loaded;
                },
                success: function() {
                    var router = new core.Router(null, lh_data || {});
                    router.add(me.registry);
                    me.add = _.bind(router.add, router);
                },
                error: function() {
                    console.error('Cannot initialize the core.Router');
                }
            });
        },

        /** Inject <script> tag to page using document.write, so it'll be immediately avaiable
         *  Prevents double add. Adds this.conf.path to src. 
         */
        inject_js: function(urls) {
            var attrs_string = '', url = {}, src = '';
            if (!urls[0])
                urls = [ urls ];
            for (var i=0, ii=urls.length; i<ii; i++) {
                attrs_string = ' ', url = urls[i], src = this.conf.paths.global + (url.src || url);
                if (!this.libs_registry[src]) {
                    if (typeof url == 'string') {
                        url = { src: src };                
                    }
                    else
                        url.src = src;
                    for (var attr in url) {
                        attrs_string+= attr + '="' + url[attr] + '" ';
                    }
                    var script_str = '<script' + attrs_string + '></script>';
                    document.write(script_str);
                    this.libs_registry[url.src] = url;
                }
            }
        }
    }

    /**
     * Wait until the test condition is true or a timeout occurs. Useful for waiting
     * on a server response or for a ui change (fadeIn, etc.) to occur.
     *
     * @param check javascript condition that evaluates to a boolean.
     * @param onTestPass what to do when 'check' condition is fulfilled.
     * @param onTimeout what to do when 'check' condition is not fulfilled and 'timeoutMs' has passed
     * @param timeoutMs the max amount of time to wait. Default value is 3 seconds
     * @param freqMs how frequently to repeat 'check'. Default value is 250 milliseconds
     */
    function waitFor(check, onTestPass, onTimeout, timeoutMs, freqMs) {
        var timeoutMs = timeoutMs || 6000,      
            freqMs = freqMs || 100,      
            start = Date.now(),
            condition = false,
            timer = setTimeout(function() {
                var elapsedMs = Date.now() - start;
                if ((elapsedMs < timeoutMs) && !condition) {
                    condition = check(elapsedMs);
                    timer = setTimeout(arguments.callee, freqMs);
                } else {
                    clearTimeout(timer); 
                    if (!condition) {
                        onTimeout(elapsedMs);
                    } else {
                        onTestPass(elapsedMs);
                    }
                }
            }, freqMs);
    }

    /**
     * @return True if browser does not support major HTML5 and CSS3 features and needs shims
     */
    function isOld() { // IE8 or worse
        var docMode = document.documentMode;
        return (/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 8));
    }

}
