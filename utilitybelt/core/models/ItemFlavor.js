/**
 * Temporary base model for Item and Flavor, so they can re-use specific .validate method
 */

core.define('core.ItemFlavor', {

    extend: 'core.Model',

    /**
     * @see http://mockapi.lieferheld.de/doc/reference/restaurants/restaurants_sections_details.html#reference-item-flavor
     */
    validate: function(data, options) {
        var errors = this.validateRelated(data, options);
        if (!errors.length) {
            //TODO look if the testing if the required elements are in
            // -1: The items contained in the flavours are joined together (A GROUP)
            // 0: Is not mandatory to select any of the items
            // 1: Is mandatory to select one and only one item
            // 2: Is mandatory to select at least one
            if(this.attributes && this.attributes.structure != null) {
                if(this.attributes.structure == "0") {
                    //no need for checking anything
                } else if(this.attributes.structure == "1") {
                    //only one item should be included
                    if(this.attributes.items.length == 1) {
                        //should be okay
                    } else {
                        errors.push(this.get('id'));
                    }
                } else if(this.attributes.structure == "2") {
                    if(this.attributes.items.length < 1) {
                        errors.push(this.get('id'));
                    }
                }
            }
        }
        return errors.length ? errors : false;
    },

    /**
     * Validate Model against its validation rules
     * @method validate
     * @returns String first validation error
     */
    validateRelated: function(data, options) {
        var validationErrors = [],
            me = this;
        if (this.relations) {
            var relations = _.filter(this.relations, function(rel) {
                return _.indexOf(['flavors', 'items'], rel.key) > -1;
            });
            _.each(relations, function(rel) {
                var related = me.get(rel.key);
                if (related && related.validate) {
                    // has one (item has one flavor)
                    validationErrors = _.union(validationErrors, related.validate(data, options) || []);
                } else if (related) {
                    // has many (flavor has many items)
                    related.each(function(subrelated) {
                        validationErrors = _.union(validationErrors, subrelated.validate(data, options) || []);
                    });
                }
            });
        }
        return validationErrors;
    }
});
