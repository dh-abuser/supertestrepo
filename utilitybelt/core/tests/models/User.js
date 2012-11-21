/**
 * core.models.User tests
 */
describe("core.models.User", function() {
    describe('Authentification process', function() {

        beforeEach(function() {
            this.record = new core.models.User();
            this.server = sinon.fakeServer.create();
            this.server.respondWith('GET', '/api/authorization/?email=foo@bar.com&pwd=wrong', [
                618,
                {'Content-Type': 'application/json'},
                JSON.stringify({error: 'something is wrong'})
            ]);
            this.server.respondWith('GET', '/api/authorization/?email=foo@bar.com&pwd=foobar', [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(tests.models.User.authorize.grant)
            ]);
        });

        afterEach(function() {
            this.server.restore();
        });

        describe('With valid credentials', function() {

            beforeEach(function() {
                this.record = new core.models.User({email: 'foo@bar.com', pwd: 'foobar'});
            });

            it('Auth succeeds', function() {
                expect(this.record.token).toBeFalsy();
                var spyDeny = sinon.spy(),
                    spyGrant = sinon.spy();
                spyOn(this.record, 'authorizeDeny');
                spyOn(this.record, 'authorizeGrant');
                this.record.authorize();
                this.server.respond();
                expect(this.record.authorizeDeny).not.toHaveBeenCalled();
                expect(this.record.authorizeGrant).toHaveBeenCalled();
            });

            it('User has a token', function() {
                expect(this.record.token).toBeFalsy();
                var spyDeny = sinon.spy(),
                    spyGrant = sinon.spy();
                this.record.authorize();
                this.server.respond();
                expect(this.record.isAuthorized()).toBeTruthy();
                expect(this.record.token).not.toBeFalsy();
            });

            it("Auth fires a grant event", function() {
                expect(this.record.token).toBeFalsy();
                var spyDeny = sinon.spy(),
                    spyGrant = sinon.spy();
                this.record.bind('authorize:deny', spyDeny);
                this.record.bind('authorize:grant', spyGrant);
                this.record.authorize();
                this.server.respond();
                expect(spyDeny.called).toBeFalsy();
                expect(spyGrant.called).toBeTruthy();
            });

        });

        describe('With wrong credentials', function() {
            
            beforeEach(function() {
                this.record = new core.models.User({email: 'foo@bar.com', pwd: 'wrong'});
            });

            it('Auth fails', function() {
                expect(this.record.token).toBeFalsy();
                var spyDeny = sinon.spy(),
                    spyGrant = sinon.spy();
                spyOn(this.record, 'authorizeDeny');
                spyOn(this.record, 'authorizeGrant');
                this.record.authorize();
                this.server.respond();
                expect(this.record.authorizeDeny).toHaveBeenCalled();
                expect(this.record.authorizeGrant).not.toHaveBeenCalled();
                expect(this.record.isAuthorized()).toBeFalsy();
            });

            it("Auth fires a deny event", function() {
                expect(this.record.token).toBeFalsy();
                var spyDeny = sinon.spy(),
                    spyGrant = sinon.spy();
                this.record.bind('authorize:deny', spyDeny);
                this.record.bind('authorize:grant', spyGrant);
                this.record.authorize();
                this.server.respond();
                expect(spyDeny.called).toBeTruthy();
                expect(spyGrant.called).toBeFalsy();
            });

        });

    });
});
