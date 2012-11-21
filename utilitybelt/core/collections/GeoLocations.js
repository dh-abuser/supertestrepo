core.define('core.collections.GeoLocations', {

    extend: 'core.Collection',

    searchParameters: ['zipcode', 'suburb', 'streetname', 'limit'],

    urlBase: '/api/geo/?',

    initialize: function() {
        this.model = core.models.Location;        
        core.collections.GeoLocations.__super__.initialize.call(this);
    },

    /**
    * Set the parameters to fetch locations
    * @param {Object} params An object specifying values for the Url parameters. The keys must be included in searchParameters
    */
    setUrlParams: function(params){
        var me = this;
        var wrongParams = _.filter(params, function(value, key){
           return !_.include(me.searchParameters, key);
        });
        if (wrongParams.length) {
            throw new Error("Please specify one ore more of the following URL parameters: " + this.searchParameters.join(", "));
        } else {
            core.collections.GeoLocations.__super__.setUrlParams.apply(this, arguments);
        }
    },

    url: function() {
        var params = this.getUrlParams();
        var url = this.urlBase;
        var paramsArray = [];
        _.each(this.searchParameters, function(param){
            if (params[param]) {
                paramsArray.push(param + "=" + params[param]);
            }
        });
        url += paramsArray.join("&");

        return url;
    }

});
