core.define('core.collections.Address', {

    extend: 'core.Collection',

    model: core.models.Address,

    initialize: function() {
//        _.bindAll(this, 'change')
//       this.on('add', function() { console.log(this, 'add') })
/*
        if (arguments[1] && arguments[1].hasOwnProperty('user_id')) {
            this.user_id = arguments[1].user_id;
        };
*/
    },

    url: function() {
    
/*
        try {
            this._assertRequiredParams();
        } catch(error) {
            // Error handling... cover this this block with tests as well
            console.log('Error constructing collection url!', error);
        };
*/

        return '/api/users/' + this.getUrlParams().user_id + '/addresses/?fields=address';
    },

    parse: function(resp, xhr) {
        var parsed = core.collections.Address.__super__.parse.call(this, resp, xhr);
        parsed = _.map(parsed, function(rec) { 
            return rec.address || rec;
        });
        return parsed;
    }

/*
    _assertRequiredParams: function() {
        if (!this.user_id) {
            throw new Error('Required parameter user_id is missing!');
        };
    },
*/
});
