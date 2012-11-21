describe("app.LandingPage", function() {

    afterEach(function() {
        $('div.lightbox').remove();
    });
    
    it("When locationNotFound is triggered, .showError() is called", function() {
        var spy = sinon.spy(app.LoggedIn.prototype, 'showError');
        var page = core.instantiate('app.LoggedIn', { user: new core.models.User() });
        page.locationSearchWidget.trigger('locationNotFound');
        expect(spy.calledOnce).toBeTruthy();
    });

    it("When locationFound is triggered, .locationFound() is called", function() {
        var spy = sinon.spy(app.LoggedIn.prototype, 'locationFound');
        var page = core.instantiate('app.LoggedIn', { user: new core.models.User() });
        page.locationSearchWidget.trigger('locationFound');
        expect(spy.calledOnce).toBeTruthy();
    });

})

