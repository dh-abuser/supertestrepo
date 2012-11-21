describe("View.FlavorsLightbox", function() {
    var flb = new core.views.FlavorsLightbox();
    var flbEl;
    var itemModel = new core.models.Item(tests.models.ItemWithNestedFlavors);
    var rendered;

    flb.on("render", function(){
        rendered = true;
    });
    flb.show(itemModel);
    
    it("test init", function() {
        waitsFor(function(){
            return rendered;
        }, "Waiting for Flavorbox to be rendered", 1000);
        runs(function(){
            flbEl = flb.$el;
        });
    });

    describe("when clicking on 'Add to Cart'", function(){
        it("Should display an error if a mandatory choice was not provided", function(){
            var flavorsInvalidated;
            flb.on("flavorsInvalid", function(){
                flavorsInvalidated = true;
            });
            flbEl.find(".button").click(); //starts flavor selection
            waitsFor(function(){
                return flavorsInvalidated;
            }, "Waiting for flavors selection to be rejected as invalid", 1000);

            runs(function(){
                var invalidSections = flbEl.find(".invalidSection");
                expect(invalidSections.length).toBeGreaterThan(0);
            });
            
        });

        it("Should return the models of flavors selected in the Lightbox", function(){
            var chosenFlavors;
            var flavorsToCheck = [1131059, 1131062];

            _.each(flavorsToCheck, function(flavorId){
                flbEl.find('[data-flavor-id]').filter(function(){
                    return $(this).data('flavor-id')==flavorId;
                }).attr("checked", "checked");
            });
            
            flb.on("flavorsChosen", function(chosenFlavorsArg){
                chosenFlavors = chosenFlavorsArg;
            });
            flbEl.find(".button").click(); //starts flavor selection

            waitsFor(function(){
                return chosenFlavors;
            }, "waiting for the function to return the selected flavors", 1000);

            runs(function(){
                _.each(flavorsToCheck, function(flavorId){
                    var flavorItem = chosenFlavors.selectedItemModel.getAllSubItems().find(function(el){
                        return el.get('id')==''+flavorId;
                    });
                    expect(flavorItem).toBeDefined();
                });

                flb.hide(); //cleanup
            });
        });
    }); 

});