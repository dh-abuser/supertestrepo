/**
 * Model is a representation of the data structures used in your application. Model defined as a set of fields.
 * For more info see [http://documentcloud.github.com/backbone/#Model](http://documentcloud.github.com/backbone/#Model)
 *
 *  Example:
 *
 *      core.define('core.models.Address', {
 *
 *          extend: 'core.Model',
 *
 *          fields: {
 *            'zipcode': { 'dataType': 'number', 'default': '' },
 *            'name': { 'dataType': 'string', 'default': '' }
 *          },
 *
 *          validations: [
 *              { field: 'zipcode', type: 'required', message_key: 'zipcode_required' },
 *              { field: 'name', type: 'required', message_key: 'required' }
 *          ]
 *      });
 *
 * @class core.Model
 * @requires Backbone.Model
 * @param {String} self Class name
 * @param {Array} validations Array of validations object
 * @param {Array} fields Array of Model fields
 */

core.define('core.Model', {

    extend: 'Backbone.RelationalModel',

    mixins: ['core.mixins.Validate'],

    /**
     * Tells if save has been invoked.
     * If it's idle, the boolean is true and false otherwise.
     */
    idle: true,

    /**
     * Remembers the number of time save was called for update.
     * The sync method is responsible of incrementing the counter
     + and he successful save handler is reponsible of decrementing it.
     */
    syncCount: 0,

    /**
     * Returns a JSON object containing the attributes of the model.
     * Similar to toJSON method, but should be preferred to use with views.
     * @return {Object} A dumb JSON object having the instance attributes
     */
    viewJSON: function() {
        return core.Model.__super__.toJSON.call(this);
    },

    /**
     * Generic getter offering easy per-attribute getter overwritting.
     * Will call getAttribute method (camelcase) if present, or
     * return the attribute value.
     * @param {string} attr The name of the attribute to get
     * @return {mixed} The result of the overwritten getter or the attribute value
     */
    get: function(attr) {
        var method = _.str.camelize('get_' + attr);
        return method in this ? this[method].call(this) : core.Model.__super__.get.call(this, attr);
    },

    /**
     * Generic has method offering easy per-attribute overwritting.
     * Will call hasAttribute method (camelcase) if present, or
     * return the attribute value.
     * @param {string} attr The name of the attribute to check existence
     * @return {mixed} The result of the overwritten has method or the attribute existence
     * @see http://documentcloud.github.com/backbone/#Model-has
     */
    has: function(attr) {
        var method = _.str.camelize('has_' + attr);
        return method in this ? this[method].call(this) : core.Model.__super__.has.call(this, attr);
    },

    /**
     * Returns the relative URL where the model's resource would be located on the server.
     * @method url
     * @returns String URL
     */
    url: function() {
        return '/model_api';
    },
    
    /**
     * Initializes the Model by setting undefined attributes to the
     * defaults specified by the fields property.
     * @method initialize
     */
    initialize: function() {
        var defaults = {};
        _.each(this.fields, function(definition, field) {
            defaults[field] = definition['default'];
        });
        this.set(_.extend(defaults, this.attributes));
    },

    /**
     * Improves Backbone.sync by providing a counter of update sync call.
     * As this counter is incremented with sync call, this method can
     * safely embedded (debounced, ...).
     * @see http://backbonejs.org/#Sync
     */
    sync: _.wrap(Backbone.sync, function(sync, method, model, options) {
        if ('update' == method) {
            model.syncCount += 1;

            var success = options.success;
            options.success = _.wrap(success, _.bind(this.syncCallbackWrapper, model));
            var error = options.error;
            options.error = _.wrap(error, _.bind(this.syncCallbackWrapper, model));
        }
        return sync.apply(this, _.tail(arguments));
    }),

    /**
     * Wrapper for ajax event callbacks that keeps idle and syncCount properties
     * in a consistent state.
     * Bear in mind that callback order is important if you plug behavior
     * on Backbone events (e.g. sync, change).
     * Make sure you put the context to the model instance.
     *
     * @see http://docs.jquery.com/Ajax_Events
     *
     * @param handler {Function} The callback to wrap
     */
    syncCallbackWrapper: function(handler, resp, status, error) {
        this.syncCount -= 1;
        this.idle = 0 === this.syncCount && 'error' != status;
        if (handler)
            handler.apply(handler, _.tail(arguments));
    },

    validate: function(data) {
        var errors = this.getValidationErrors(data);
        if (errors.length > 0)
            return errors[0];
    },

    /**
     * Overwritten method providing a status:
     * true if no sync is ongoing, false otherwise.
     * @see http://backbonejs.org/#Model-save
     */
    save: function(key, value, options) {
        // if keys is an explicit empty string, overwrite options
        // to comply with API and Backbone (empty data + json content type)
        if ('' === key) {
            // if key is empty, second param is options
            _.extend(value, {
                data: '',
                contentType: 'application/json'
            });
            key = null;
        }

        this.idle = false;
        return core.Model.__super__.save.call(this, key, value, options);
    },

    /**
     * Tells if a model is ready for a sync call, i.e. if
     * no sync is currently active or planned.
     * @return {Boolean} True if no sync is currently active, false otherwise
     */
    isReadyForSync: function() {
        return this.idle && !this.syncCount;
    }
});
