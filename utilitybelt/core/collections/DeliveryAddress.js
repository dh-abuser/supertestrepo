core.define('core.collections.DeliveryAddress', {

    extend: 'core.Collection',

    model: core.models.DeliveryAddress,


    url: function() {
        return '/api/users/' + this.getUrlParams().user_id + '/addresses/?fields=address';
    },

    // parse: function(resp, xhr) {
    //     var parsed = core.collections.Address.__super__.parse.call(this, resp, xhr);
    //     parsed = _.map(parsed, function(rec) { 
    //         return rec.address || rec;
    //     });
    //     return parsed;
    // }

    search: function(address, options) {
        var hash = address.self ? address.toJSON() : address;
        return this.fetch(_.extend({}, options, {
            success: function(collection, response) {
                var matches = collection.filter(function(match) {
                    for (var key in hash) {
                        if (hash[key] !== match.get('address').get(key)) {
                            return false;
                        }
                    }
                    return true;
                });
                if (!matches.length) {
                    collection.trigger('noMatch', address);
                }
                else if (1 === matches.length) {
                    collection.trigger('match', matches[0]);
                }
                else {
                    collection.trigger('multipleMatches', matches);
                }
            }
        }));
    }
});
