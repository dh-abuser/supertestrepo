/**
 * Lightbox which displays a list of flavors for a menu item
 *
 * Examples:
 *
 *     var lb = new core.views.FlavorsLightbox();
 *     lb.show(item);
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.FlavorsLightbox', {

    extend: 'core.views.Lightbox',

    templateFlavor: "Flavors/flavors.html",

    events: {
        "click .top-box .close-icon": "hide",
        "click .button": "chooseFlavors",
        "click input[data-flavor-id]": 'recalculatePrice'
    },

    className: 'FlavorsLightbox',

    plugins: {
        'section': 'jqTransform'
    },

    /**
     * Constructor
     * @constructor
     * @param {Object} options Options
     */
    initialize: function(options) {
        var me = this;
        core.utils.getTemplate(me.templateFlavor, function(tpl) {
            me.templateFlavor = tpl;
        });
        core.views.FlavorsLightbox.__super__.initialize.call(this, options);
    },

    /**
    * Display the flavors lightbox for a menu item
    * @param {core.models.Item} item The backbone model (with flavors information) for the menu item
    */
    show: function(item) {
        this.item = item;
        this.itemJSON = item.viewJSON();
        this.basePrice = this.itemJSON.sizes[0].price;

        //add all flavors to a view-wide collection so they can easily be retrieved by ID
        this.allFlavors = item.getAllSubItems();

        
        this.title = this.itemJSON.name;
        this.options.content = _.template(this.templateFlavor)( _.extend(this.itemJSON, {
            getType: function(flavorContainer){
                if (flavorContainer.flavors.structure == null){
                    throw new Error("Invalid flavor structure");
                }
                var type = "radio";
                if (flavorContainer.flavors.structure == "0" || flavorContainer.flavors.structure == "2"){
                    type = "checkbox";
                }
                return type;
            }
        }));
        core.views.FlavorsLightbox.__super__.show.call(this);

        this.setDisplayedPrice(core.utils.formatPriceWithoutCurrency(this.basePrice));
    },

    /**
    * Validates the flavors chosen for the item. If the validation is successful, the item is added to the cart.
    * Otherwise, the invalid sections are highlighted.
    */
    chooseFlavors: function() {
        var clonedItem = {};
        jQuery.extend(true, clonedItem, this.itemJSON);
        var itemModel = this.createItemWithSelectedFlavors(this.getSelectedFlavors(), clonedItem);

        var errorDiv = this.$(".flavors_error_message")
        //VALIDATION
        var errors = itemModel.validate();
        var me = this;
        if(errors) {
            errorDiv.html("");
            this.$(".flavors-section-header").removeClass("invalidSection");
            var scrolled = false;
            _.each(errors, function(formId) {
                var form = this.$("#" + formId);
                if(form.length) {
                    if(!scrolled && me.isOverflowing()){
                        core.utils.Dom.scrollTop(form[0]); //scroll to the *first* invalid form
                        scrolled = true;
                    }
                    form.find(".flavors-section-header").addClass("invalidSection");
                }
            }, me);
            errorDiv.html(jsGetText("flavors_message_choose"));
            this.trigger("flavorsInvalid");
        } else {
            this.trigger("flavorsChosen", {
                selectedItemModel: itemModel
            });
            this.hide();
        }
    },

    /**
    * Creates a core.models.Item model for an item object. The resulting model contains only the flavors specified in flavorsArray.
    * @param {Array} flavorsArray An array of ID strings of flavors to be included in the returned Item model
    * @param {Object} selectedItem The object data structure for the menu item
    */    
	createItemWithSelectedFlavors: function(flavorsArray, selectedItem) {

        //TODO support arbitrary depth flavor nesting !! ditto for flavors.js
        //FIXME selectedItem is not a backbone model anymore
        for(var i = 0, subItems = selectedItem.flavors.items; i < subItems.length; i++) {
            var subItem = subItems[i];
            for(var j = 0, subSubItems = subItem.flavors.items; j < subSubItems.length; j++) {
                var subSubItem = subSubItems[j];
                var subSubId = subSubItem.id;
                if(!_.include(flavorsArray, subSubId)) {
                    subItem.flavors.items = _.difference(subItem.flavors.items, [subSubItem])
                }
            }
        }
        //all unselected flavors have been removed from the selectedItem.
        var selectedItemModel = new core.models.Item(selectedItem);
        return selectedItemModel;
    },

    /**
    * Schedule this.calculateTotalPrice() for asynchronous execution, allowing the UI to update state
    * @param {Object} evt The event object
    */
    recalculatePrice: function(evt) {
        var me = this;
        setTimeout(function() {
            me.calculateTotalPrice();
        }, 1);

    },

    /**
    * Returns the ID's of flavors that have been selected
    * @return {Array} An array of stirng, one for each ID
    */
    getSelectedFlavors: function() {
        var checkedInputs = this.$el.find("form input:checked");
        var flavorIds = _.map(checkedInputs, function(input) {
            return $(input).data('flavor-id') + '';
        });
        return flavorIds;
    },

    /**
    * Updates the total price displayed in the view.
    */
    calculateTotalPrice: function() {
        var selectedFlavors = this.$el.find("form input:checked");
        var me = this;
        var newPrice = this.basePrice;


        _.each(selectedFlavors, function(elem) {
            var id = $(elem).data('flavor-id') + '';
            var selectedFlavor = this.allFlavors.find(function(el){
                return el.get('id') == id;
            });
            if(selectedFlavor && selectedFlavor.get('sizes')) {
                var flavorPrice = selectedFlavor.get('sizes').at(0).get('price');
                newPrice += flavorPrice;
            }
        }, me);
        this.setDisplayedPrice(core.utils.formatPriceWithoutCurrency(newPrice));
    },

    /**
    * Sets the displayed price to a specific value
    * @param {String} price The price to be set
    */
    setDisplayedPrice: function(price) {
        this.$el.find(".total_price h3.right").text(price);
    },

    demo: function() {
        var demoItem = {
                "flavors": {
                    "items": [{
                        "flavors": {
                            "items": [{
                                "description": "",
                                "sizes": [{
                                    "price": 0.60,
                                    "name": "normal"
                                }],
                                "pic": "",
                                "main_item": false,
                                "sub_item": true,
                                "id": "1131061",
                                "name": "Balsamico"
                            }, {
                                "description": "",
                                "sizes": [{
                                    "price": 0.60,
                                    "name": "normal"
                                }],
                                "pic": "",
                                "main_item": false,
                                "sub_item": true,
                                "id": "1131062",
                                "name": "Caesar*1"
                            }],
                            "id": "76666",
                            "structure": "0"
                        },
                        "description": "",
                        "sizes": [],
                        "pic": "",
                        "main_item": false,
                        "sub_item": false,
                        "id": "76666",
                        "name": "Extra Dressing"
                    }, {
                        "flavors": {
                            "items": [{
                                "description": "",
                                "sizes": [{
                                    "price": 0.00,
                                    "name": "normal"
                                }],
                                "pic": "",
                                "main_item": false,
                                "sub_item": true,
                                "id": "1131059",
                                "name": "Balsamico"
                            }, {
                                "description": "",
                                "sizes": [{
                                    "price": 0.00,
                                    "name": "normal"
                                }],
                                "pic": "",
                                "main_item": false,
                                "sub_item": true,
                                "id": "1131060",
                                "name": "Caesar*1 "
                            }, {
                                "description": "",
                                "sizes": [{
                                    "price": 0.00,
                                    "name": "normal"
                                }],
                                "pic": "",
                                "main_item": false,
                                "sub_item": true,
                                "id": "1131057",
                                "name": "ohne Dressing"
                            }],
                            "id": "76665",
                            "structure": "1"
                        },
                        "description": "",
                        "sizes": [],
                        "pic": "",
                        "main_item": false,
                        "sub_item": false,
                        "id": "76665",
                        "name": "Dressing"
                    }],
                    "id": "1633809",
                    "structure": "-1"
                },
                "description": "und Parmesan (inkl. 1 Dressing) ",
                "sizes": [{
                    "price": 4.50,
                    "name": "normal"
                }],
                "pic": "",
                "main_item": true,
                "sub_item": false,
                "id": "1633809",
                "name": "Gemischter Salat mit H\u00e4hnchenbrustfilet "
        }

        var demoItemModel = new core.models.Item(demoItem);

        var flb = new core.views.FlavorsLightbox();
        var $result = $('<a class="button">Have a Gemischter Salat!</a>').click( function() {
            flb.show(demoItemModel);
            flb.on("flavorsChosen", function(flavorsObj) {
                //me.cartCollection.add(flavorsObj.selectedItemModel); //just a demo!
            });
        });
        return $result;
    }
});