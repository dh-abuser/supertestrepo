describe("Throbber", function() {

    beforeEach(function() {
        this.thb = new core.views.Throbber();
    })

    afterEach(function() {
        this.thb.hide();
        this.thb.remove();
    })

    describe("base methods", function() {
        it("should offer show and hide methods", function() {
            expect(typeof this.thb.show).toEqual("function");
            expect(typeof this.thb.hide).toEqual("function");
        });
    });
    describe("testing timing settings", function() {
        it("fade in time 200ms", function() {
            runs(function() {
                elem = this.thb.$el.find("img");
                this.thb.setDelay(0);
                this.thb.setFadeInTime(200);
                this.thb.show();
                elem = this.thb.$el.find("img");
            });
            waitsFor(function() {
                return (elem.css("opacity") == 1);
            }, "opacity has to be 1 after 200ms", 201);
            runs(function() {
                this.thb.hide();
                this.thb.setDelay(200);
                this.thb.setFadeInTime(200);
                this.thb.show();
                expect(elem.css("opacity") == 1).toBeTruthy();
            });
            waitsFor(function() {
                return elem.css("opacity") != 0;
            }, "opacity should change after 200ms", 201);
            runs(function() {
                this.thb.hide();
                expect(elem.css("opacity") == 1).toBeTruthy();
            })
        })
    });
    describe("testing timeout", function() {
        it("testing the timeout function: should do a call to the callback function", function() {
            var spy;
            runs(function() {
                spy = jasmine.createSpy();
                this.thb.show(1000, spy);
            });
            waitsFor(function() {
                return spy.callCount > 0;
            }, 1100);
            runs(function() {
                expect(spy).toHaveBeenCalled();
                spy = jasmine.createSpy();
                this.thb.show(100, spy);
                this.thb.hide();
            });
            waits(400);
            runs(function() {
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
