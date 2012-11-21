
describe("Collection", function() {

    describe("It can be created, initialized and validated", function() {

        it("Creates", function() {
            var rec = new core.Collection();
            expect(rec).toBeDefined();
        });

        it("Can be extended", function() {

            var mycoll_class = core.Collection.extend();
            var coll = new mycoll_class();

            expect(mycoll_class).toBeDefined();
            expect(coll).toBeDefined();

        });

        it("Correctly fills with data", function() {

            core.define('mymdl_class', {
                extend: 'core.Model',
                fields: { field1: { default: '' } }
            });
            var rec = new mymdl_class({ field1: 'bar', id: 1 });

            core.define('mycoll_class', { 
                model: mymdl_class, 
                extend: 'core.Collection'
            });

            var coll = new mycoll_class();
            coll.add(rec);
            
            expect(coll.get(1).get('field1')).toEqual('bar');

        });

    describe("It can work with remote datasource", function() {

        beforeEach(function() {
            this.srv = sinon.fakeServer.create();
            this.url = '/api';
            this.headers = {"Content-Type": "application/json"};

            core.define('mymdl_class', {
                extend: 'core.Model',
                fields: { field1: { default: '' } },
                url: this.url
            });

            core.define('mycoll_class', { 
                model: mymdl_class, 
                extend: 'core.Collection',
                url: this.url
            });

            this.coll = new mycoll_class();

        });

        afterEach(function() {
            this.srv.restore();
        });
                 
        it("Fetch data with success", function() {

            this.srv.respondWith("GET", this.url,
              [200, this.headers, '{"data": [{"id":1, "field1": "bar2"}]}']);

            var callback = sinon.spy();

            this.coll.fetch({ success: callback });

            this.srv.respond(); 

            expect(callback.called).toBeTruthy();
           
            expect(callback.getCall(0).args[0].get(1).get('field1')).toEqual('bar2');

        });

        it("Fetch data with error", function() {

            this.srv.respondWith("GET", this.url,
              [500, this.headers, '']);

            var callback = sinon.spy();

            this.coll.fetch({ error: callback });

            this.srv.respond(); 

            expect(callback.called).toBeTruthy();
           
            expect(callback.getCall(0).args[1].status).toEqual(500);

        });

    });

    });

});