/**
 * Exit Poll Collection, represents a data object for exit poll.
 */
core.define('core.collections.ExitPoll', {

    extend: 'core.Collection',

    model: core.models.ExitPoll,
    
    getShuffledOptions: function(){
        return _.shuffle(this.models);
    },
    
    validate: function(data){
        return !jQuery.isEmptyObject(data);
    }
    
});
