describe("Lightbox", function() {
    var view = null;
    beforeEach(function() {
        view = new core.views.Lightbox();
    });
    afterEach(function() {
        if (view != null) {
            view.hide();
            view = null;
        }
    });
    describe("initializing the lightbox", function() {
        it("test init", function() {
            runs(function() {
                view.show();
            })
            waitsFor(function() {
                return view.$el.is(":visible");
            }, "Lightbox should be shown", 1000);
        });
    });

    describe("testing that different templates work", function() {
        it("test init", function() {
            runs(function() {
                view = new core.views.Lightbox({
                    template : "Lightbox/small.html"
                });
                view.show();
            })
            waitsFor(function() {
                return view.$el.is(":visible");
            }, "Lightbox should be shown", 1000);
            runs(function() {
                expect(view.$el.hasClass("lb-small")).toBeTruthy();
                view.hide();
            });
            waitsFor(function() {
                return !view.$el.is(":visible");
            }, "Lightbox should be hidden after a while", 1000);
            runs(function() {
                view = new core.views.Lightbox({
                    template : "Lightbox/base.html"
                });
                view.show();
            });
            waitsFor(function() {
                return view.$el.is(":visible");
            }, "Lightbox should be shown again", 1000);
            runs(function() {
                expect(view.$el.hasClass("lb-big")).toBeTruthy();
                expect(view.$el.find(".closeLB").length).toBe(0);
            });
        });
    });

    describe("testing that different templates with close button work", function() {
        it("different templates small and base", function() {
            runs(function() {
                view = new core.views.Lightbox({
                    template : "Lightbox/small.html",
                    closeButton : true
                });
                view.show();
            })
            waitsFor(function() {
                return view.$el.is(":visible");
            }, "Lightbox should be shown", 1000);
            runs(function() {
                expect(view.$el.hasClass("lb-small")).toBeTruthy();
                expect(view.$el.find(".closeLB").length).toBe(1);
                view.hide();
            });
            waitsFor(function() {
                return !view.$el.is(":visible");
            }, "Lightbox should be hidden after a while", 1000);
            runs(function() {
                view = new core.views.Lightbox({
                    template : "Lightbox/base.html",
                    closeButton : true
                });
                view.show();
            });
            waitsFor(function() {
                return view.$el.is(":visible");
            }, "Lightbox should be shown again", 1000);
            runs(function() {
                expect(view.$el.hasClass("lb-big")).toBeTruthy();
                expect(view.$el.find(".closeLB").length).toBe(1);
            });
        });
    });

    describe("testing close button", function() {
        var spy = null;
        it("closing via close button", function() {
            runs(function() {
                view = new core.views.Lightbox({
                    closeButton : true
                });
                view.show();
            })
            waitsFor(function() {
                return view.$el.is(":visible");
            }, "Lightbox should be shown", 1000);
            runs(function() {
                expect(view.$el.find(".closeLB").length).toBe(1);
                spyOn(view, "hide").andCallThrough();
                view.delegateEvents();
                view.$el.find(".closeLB").trigger("click");
            });
            waitsFor(function() {
                return !view.$el.is(":visible");
            }, "Lightbox should be hidden after a while", 1000);
            runs(function() {
                expect(view.hide).wasCalled();
            });
        });
    });

});
