describe("LocationSearch", function() {
    beforeEach(function() {
        this.view = null;
        divElement = document.createElement("DIV");
        divElement.setAttribute("id", "search_placeholder");
        document.body.appendChild(divElement);
        this.view = new core.views.LocationSearch({
            renderToEl: $(divElement)
        });
    });
    afterEach(function() {
        if (this.view != null) {
            this.view.remove();
            this.view == null;
        }
        document.body.removeChild(divElement);
    });
    describe("When instantiated", function() {
        it("this is the environment for it to run", function() {
            var i = 0;
            waitsFor(function() {
                return this.view != null;
            }, "view not created!!!", 1000);
            runs(function() {
                expect(this.view.el.nodeName).toBe("DIV");
                expect(this.view.$el.find("input[name='location']")).not.toBe(null);
            });
        });
    });
    describe("Testing Empty Input", function() {
        it("test empty input", function() {
            waitsFor(function() {
                return this.view != null;
            }, "view not created!!!", 1000);
            waitsFor(function() {
                return $(".big_input").length > 0;
            }, "element created", 1000);
            runs(function() {
                expect(this.view.__disabled).not.toBeTruthy();
                $(".big_input").submit();
                expect(this.view.__disabled).toBeTruthy();
            });
            waitsFor(function() {
                return !this.view.__disabled;
            }, "popup has to be removed after 2s", 2100);
            runs(function() {
                expect(this.view.__disabled).not.toBeTruthy();
            })
        });
    });
    describe("Testing Any Input goes To Collection.fetch", function() {
        it("if the collection fetch method is called", function() {
            waitsFor(function() {
                return this.view != null;
            }, "view not created!!!", 1000);
            waitsFor(function() {
                return $(".big_input").length > 0;
            }, "element created", 1000);
            runs(function() {
                var inputValue = "";
                core.collections.Locations = function() {
                    this.setUrlParams = function(params) {
                        inputValue = params.searchLocation;
                    };
                    this.fetch = function() {
                    }
                };
            });
        });
    });
});
