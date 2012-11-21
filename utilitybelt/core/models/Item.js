/**
 * Item Model, represents a menu item, related to its flavors and sizes
 */
core.define('core.models.Item', {

    extend: 'core.ItemFlavor',

    idAttribute: false,

    fields: {
        'id': { 'dataType': 'number', 'default': '' },
        'main_item': { 'dataType': 'string', 'default': '' },
        'sub_item': { 'dataType': 'string', 'default': '' },
        'name': { 'dataType': 'string', 'default': '' },
        'description': { 'dataType': 'string', 'default': '' },
        'pic': { 'dataType': 'string', 'default': '' }
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'sizes',
            relatedModel: 'core.models.ItemSize',
            // this relation must not be included when talking to backend
            includeInJSON: false
        },
        {
            type: Backbone.HasOne,
            key: 'size',
            relatedModel: 'core.models.ItemSize'
        },
        {
            type: Backbone.HasOne,
            key: 'flavors',
            relatedModel: 'core.models.Flavor'
        }
    ],

    initialize: function() {
        core.models.Item.__super__.initialize.call(this);
    },

    /**
     * Returns a lightweight dumb object representing the instance.
     * Stripped down to comply with API and consume less weight.
     * @return {Object} A lightweight and dumb representation of the instance
     */
    toJSON: function() {
        // var json = core.models.Item.__super__.toJSON.call(this);
        var json = {
            id: this.get('id'),
            name: this.get('name'),
            quantity: this.get('quantity')
            // size: (this.get('size') || this.get('sizes').at(0)).toJSON()
        };
        if (this.has('flavors') && this.get('flavors').get('items').length) {
            json.flavors = this.get('flavors').toJSON();
        }
        if (this.has('size')) {
            json.size = this.get('size').toJSON();
        } else if (this.has('sizes') && this.get('sizes').length) {
            json.size = this.get('sizes').at(0).toJSON();
        }
        return json;
    },

    /**
    * Returns a JSON representation of an item to be used for view purposes (e.g. by the flavors lightbox)
    * @return {Object} The javascript object representing this
    */
    viewJSON: function(){
        var json = _.extend({}, this.attributes);
        if(this.has('flavors')){
            json.flavors = {};
            json.flavors.items = [];
            this.getSubItems().each(function(el){
                json.flavors.items.push(el.viewJSON());
            });
            json.flavors.id = this.get('flavors').get('id');
            json.flavors.structure = this.get('flavors').get('structure');
        }
        if(this.has('sizes')){
            json.sizes = this.get('sizes').toJSON();
        }
        return json;


    },

    /**
     * Computes the full identifier of the item. The full name identify the item and its flavor (and the sub-items, recursively).
     * @return {String} A string made of the ids of the item and the fullname of its flavor
     * TODO rename this function to fullID() which is more appropriate
     */
    fullID: function() {
        return this.attrPath('id', '-', true, true, false);
    },

    /**
     * Recursively farms a given attribute in an item tree. What is farmed can be controlled
     * by the boolean flags to control which nodes are used.
     * Recurses depth-first.
     * @param {String} attr The name of the attribute to farm
     * @param {String} sep The separator used to glue the farmed values
     * @param {Boolean} allNode Tells if inner item nodes of the tree flavor should be used or not
     * @param {Boolean} withSize Tells if size nodes should be used or not
     * @param {Boolean} withSize Tells if flavor nodes should be used or not
     * @return {String} A compound string made of farmed value glued using the given separator
     */
    attrPath: function(attr, sep, allNodes, withSize, withFlavor) {
        var path = [];
        // takes only main item and leaves when only items
        if (allNodes || (this.get('main_item') || !this.has('flavors'))) {
            path.push(this.get(attr));
        }
        // size is part of the item, if available always include it
        var size = this.get('size') || this.get('sizes').at(0);
        if (size) {
            var sizePath = size.attrPath(attr, sep, allNodes, withSize, withFlavor);
            (sizePath && path.push(sizePath));
        }
        var flavor = this.get('flavors');
        if (flavor) {
            var flavorPath = flavor.attrPath(attr, sep, allNodes, withSize, withFlavor);
            (flavorPath && path.push(flavorPath));
        }
        return path.join(sep);
    },

    hasFlavors: function() {
        var flavors = this.get('flavors');
        return flavors && flavors.get('items').length;
    },

    /**
     * Helper function that gets the display name of an item,
     * i.e. a compound of item name and flavor item names.
     * @return {String} A displayable name, including sub-item names
     */
    displayName: function() {
        return this.attrPath('name', ', ', false, false, false);
    },

    /**
     * Gets the price of the item.
     * If the the item has some flavors, their price will be included as well.
     * @return {number} The total price of the item and its flavors
     */
    price: function() {
        var flavors = this.get('flavors'),
            size = this.get('size') || this.get('sizes').at(0),
            item_price = 0;
        if (!size){
            if(this.get('main_item')){
                throw new Error('no-size-available');
            }
        } else {
            item_price = size.price();
        }
        return item_price + (flavors ? flavors.price() : 0);
    },

    /**
    * Returns the item's sub-items (i.e., in the flavor hierarchy, the item's flavors)
    * @return {Backbone.Collection} The collection of sub-items
    */
    getSubItems: function(){
        var flavors = this.get('flavors');
        return flavors ? flavors.get('items') : null;        
    },

    /**
    * Returns all the sub-items in the hierarchy from the given item. (see getSubItems() )
    * @param {Backbone.Collection} collParam If specified, all sub items will be added to it. Otherwise, a new collection will be returned.
    * @return {Backbone.Collection} The collection of sub-items
    */
    getAllSubItems: function(collection){
        var subitems;
        collection || (collection = new Backbone.Collection);
        if(this.get('flavors')){
            subitems = this.getSubItems();
            subitems.each(function(el){
                collection.add(el);
                el.getAllSubItems(collection);
            });
        }
        return collection;
    }
});
