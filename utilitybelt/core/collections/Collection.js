core.define('core.Collection', {
    extend: 'Backbone.Collection',

    /**
     * Returns an array JSON objects containing the attributes of the collection models.
     * Similar to toJSON method, but should be preferred to use with views.
     * Available to enable different JSON to be used by views and Backbone.sync.
     * @return {Array of Object} An array of dumb JSON objects having the models attributes
     */
    viewJSON: function() {
        return this.map(function(model){ return model.viewJSON(); });
    },

    parse: function(resp, xhr) {
        var parsed = resp.data || resp.response.data;
        for (var i=0, ii=parsed.length; i<ii; i++) {
            for (var field in parsed[i]) {
                if (typeof parsed[i][field] == 'string')
                    parsed[i][field] = parsed[i][field].replace("\"", "\\\"");
            }
        }
        return parsed;
    },

    bindTo: function(view) {
        var coll = this;
        coll.off('reset change');
        coll.on('reset change', function() {
            this.trigger('beforerender');
            _.bind(view.render, view)();
        }, coll);
    },

    setUrlParams: function(params) {
        this.urlParams = params;
    },

    getUrlParams: function() {
        return this.urlParams;
    },

    url: function() {
        return '/api' + (new this.model().urlRoot) + '/';
    }
});
