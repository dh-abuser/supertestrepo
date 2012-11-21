core.define('core.collections.Order', {

    extend: 'core.Collection',
    
    model: core.models.Order,
    
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

    console.log(this.user_id)

/*
        try {
            this._assertRequiredParams();
        } catch(error) {
            // Error handling... cover this this block with tests as well
            console.log('Error constructing collection url!', error);
        };
*/

        return '/api/users/' + this.getUrlParams().user_id + '/orders/?fields=order';
    },

    parse3: function(resp, xhr) {
        console.log(arguments)
    },

    parse2: function(resp, xhr) {
        var parsed = core.collections.Address.__super__.parse.call(this, resp, xhr);
        parsed = _.map(parsed, function(rec) { 
            return rec.address;
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