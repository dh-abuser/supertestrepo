/*
 *  core.Model Tests
 *
 */

describe("Model", function() {

    describe("It can be created, initialized and validated", function() {

        it("Creates", function() {
            var rec = new core.Model();
            expect(rec).toBeDefined();
        });

        it("Can be extended", function() {

            var mymdl_class = core.Model.extend();
            var rec = new mymdl_class();

            expect(mymdl_class).toBeDefined();
            expect(rec).toBeDefined();

        });

        it("Child has core.Model methods", function() {
            core.define('core.models.test', {extend:'core.Model'});
            var rec = new core.models.test();
            expect(core.models.test.__super__.self).toEqual('core.Model');
            expect(rec.parent.self).toEqual('core.Model');
            expect(rec.fetch).toBeDefined();
            expect(rec.save).toBeDefined();
            expect(rec.destroy).toBeDefined();
        });

        it("Correctly fills with data", function() {

            var mymdl_class = core.Model.extend( {
                fields: { field1: { default: '' } }
            });
            var rec = new mymdl_class({ field1: 'bar' });

            expect(rec.get('field1')).toEqual('bar');

        });

        it("Initialize fields", function() {

            var mymdl_class = core.Model.extend({
                fields: { field1: { default: 'bar' }, field2: {} }
            });
            var rec = new mymdl_class();

            expect(rec.has('field1')).toBeTruthy();
            expect(rec.has('field2')).toBeFalsy();

        });
    });

    describe("Mixins can be defined", function() {
        beforeEach(function() {
            core.mixins.Mix = { mix: function() { return 'core.mixins.Mix';} };
            core.mixins.SubMix = { submix: function() { return 'core.mixins.SubMix';} };
            core.define('core.models.Mix', {
                extend: 'Backbone.Model',
                mixins: ['core.mixins.Mix']
            });
        });

        it('Model owns mixin members', function() {
            var m = new core.models.Mix();
            expect(m.mix).toBeDefined();
            expect(m.mixins).toEqual(['core.mixins.Mix']);
        });

        it('SubModel owns parent and own mixin members', function() {
            core.define('core.models.SubMix', {
                extend: 'core.models.Mix',
                mixins: ['core.mixins.SubMix']
            });
            var m = new core.models.SubMix();
            expect(m.mix).toBeDefined();
            expect(m.mix()).toEqual('core.mixins.Mix');
            expect(m.submix).toBeDefined();
            expect(m.submix()).toEqual('core.mixins.SubMix');
            expect(m.mixins).toEqual(['core.mixins.Mix', 'core.mixins.SubMix']);
        });

        it('SubModel can overwrite parent mixin members', function() {
            core.define('core.models.SubMix', {
                extend: 'core.models.Mix',
                mixins: ['core.mixins.SubMix'],
                mix: function() { return 'overwritten mixin'; }
            });
            var m = new core.models.SubMix();
            expect(m.mix).toBeDefined();
            expect(m.mix()).toEqual('overwritten mixin');
        });
    });
 
    describe("It can work with remote datasource", function() {

        beforeEach(function() {
            this.srv = sinon.fakeServer.create();
            this.url = '/api';
            this.headers = {"Content-Type": "application/json"};
        });

        afterEach(function() {
            this.srv.restore();
        });
                 
        it("Fetch data with success", function() {

            var mymdl_class = core.Model.extend({
                fields: { field1: { default: 'bar' }, field2: {} }
                , url: this.url
            });

            var rec = new mymdl_class({id: 1});

            this.srv.respondWith("GET", this.url,
              [200, this.headers, '{"id":1, "field1": "bar2"}']);

            var callback = sinon.spy();

            rec.fetch({ success: callback });

            this.srv.respond(); 

            expect(callback.called).toBeTruthy();
           
            expect(callback.getCall(0).args[0].attributes.field1).toEqual('bar2');

        });

        it("Fetch data with error", function() {

            var mymdl_class = core.Model.extend({
                fields: { field1: { default: 'bar' }, field2: {} }
                , url: this.url
            });

            var rec = new mymdl_class({id: 1});

            this.srv.respondWith("GET", this.url,
              [500, this.headers, '{"id":1, "field1": "bar2"}']);

            var callback = sinon.spy();

            rec.fetch({ error: callback });

            this.srv.respond(); 

            expect(callback.called).toBeTruthy();
           
            expect(callback.getCall(0).args[1].status).toEqual(500);

        });

        it("Save data with success", function() {

            var mymdl_class = core.Model.extend({
                fields: { field1: { default: 'bar' }, field2: {} }
                , url: this.url
            });

            var rec = new mymdl_class({id: 1, field1: 'foo'});
//            rec.set({ field1: 'foo2' });

            this.srv.respondWith("PUT", this.url,
              [200, this.headers, '{"id":1, "field1": "foo"}']);

//            rec.fetch();

            var callback = sinon.spy();

            rec.save({}, { success: callback });

            this.srv.respond(); 

            expect(callback.called).toBeTruthy();
            expect(callback.getCall(0).args[0].attributes.field1).toEqual('foo');

        });

    });

});