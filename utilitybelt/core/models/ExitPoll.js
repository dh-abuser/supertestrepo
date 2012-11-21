/**
 * Exit Poll Model, represents a data object.
 */
core.define('core.models.ExitPoll', {

    extend: 'core.Model',

    idAttribute: false,

    fields: {
        'ga_name': { 'dataType': 'string' }, 
        'display': { 'dataType': 'string' } 
    }
});
