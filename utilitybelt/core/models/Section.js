/**
 * Menu's Section Model, represents a section in the menu or user order (http://mockapi.lieferheld.de/doc/reference/users/user_orders_details.html#section)
 */
core.define('core.models.Section', {

    extend: 'core.Model',

    fields: {
        'id': { 'dataType': '', 'default': '' },
        'name': { 'dataType': '', 'default': '' },
        'pic': { 'dataType': '', 'default': '' }
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'items',
            relatedModel: 'core.models.Item'
        }
    ],

    validations: [
    ],

    initialize: function() {
    },

    /**
     * Returns a lightweight dumb object representing the instance.
     * Stripped down to comply with API and consume less weight.
     * @return {Object} A lightweight and dumb representation of the instance
     */
    toJSON: function() {
        return {
            id: this.id,
            items: this.get('items').toJSON()
        };
    }
});
