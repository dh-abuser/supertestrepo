core.define('core.collections.Locations', {

    extend: 'core.Collection',

    initialize: function() {
        this.model = core.models.Location;        
        core.collections.Locations.__super__.initialize.call(this);
    },

    url: function() {
        var params = this.getUrlParams(), url = '/api/locations/?address=' + params['searchLocation'];
        if (typeof params['limit'] !='undefined')
            url += '&limit=' + params['limit'];
        return url;
    },                                      

    parse: function(resp, xhr) {
        var parsed = core.collections.Locations.__super__.parse.call(this, resp, xhr);
         parsed = _.map(parsed, function(rec) { 
            return rec.response || rec;
        });
        return parsed;
    },

    /**
     * Filter collection, leaving only the records with non-empty suburb, city and zipcode and where suburb or zipcode matching the search 
     * TODO: implement in /locations API
     * @return {Collection} Locations collection
     */
    filterByRelevance: function(searchTerm) {
        var me = this, term = searchTerm.toLowerCase();
        var list =  me.filter( function(location) {
            var address = location.get('address'); 
            if (address) {
                if (!address.suburb || !address.city || !address.zipcode) // these fields are mandatory for us
                    return false;
                else {
                    var suburb = address.suburb.toLowerCase(), zipcode = address.zipcode.toLowerCase();
                    return (suburb.indexOf(term)>=0 || zipcode.indexOf(term)>=0 || term.indexOf(suburb)>=0 || term.indexOf(zipcode)>=0);
                }
            }
            return false;
        });
        return new core.collections.Locations(list);
    },

    /**
     * Sort collection, so exact matches in suburb or zipcode will be on top
     * TODO: implement in /locations API
     * @return {Collection} Locations collection
     */
    sortByRelevance: function(searchTerm) {
        var me = this;
        var list = me.sortBy( function(location) { 
            var address = location.get('address'),
                term = searchTerm.toLowerCase();
            var ind = address.suburb.toLowerCase().indexOf(term) * address.zipcode.indexOf(term);
            if (address.suburb.toLowerCase() == term || address.zipcode == term)
                return -1;
            else if (ind < 0)
                return me.length;
            else
                return ind;
        } );
        return new core.collections.Locations(list);
    },

    /**
     * Create array which can be consumed by jQuery autocomplete  plugin
     * @return {Array} Array
     */
    buildAutosuggestList: function() {
        return this.map( function(location) {
            var address = location.get('address');
            return { label: address.suburb + ' ' + (address.zipcode || '')  + ', ' + address.state, record: address };
        });
    }

});
