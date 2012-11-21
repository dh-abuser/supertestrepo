/**
 * core.mixins.Validate tests
 */
describe("core.mixins.Validate", function() {
    beforeEach(function() {
        core.define('core.ValidateModel', {
            extend: 'Backbone.Model',
            mixins: ['core.mixins.Validate']
        });
    });

    describe('Scheme setup', function() {
        it('A single rule can be written without array notation', function() {
            var m = new core.ValidateModel();
            m.set('name', '');
            m.validation = { name: {check: 'notEmpty'} };
            var rules = m.getRules(['name'], false);

            var n = new core.ValidateModel();
            n.set('name', '');
            n.validation = { name: [{check: 'notEmpty'}] };
            expect(n.getRules(['name'], false)).toEqual(rules);
        });

        it('Multiple rules can be defined', function() {
            var m = new core.ValidateModel();
            m.validation = { name: [{check: 'notEmpty'}, {check: 'required'}] };
            expect(m.getRules().length).toEqual(2);
            m.set('name', 'oui');
            expect(m.validationErrors.length).toEqual(0);
            m.set('name', '');
            expect(m.validationErrors.length).toEqual(1);
            expect(m.validationErrors[0].rule).toEqual('notEmpty');
            m.unset('name');
            expect(m.validationErrors.length).toEqual(1);
            expect(m.validationErrors[0].rule).toEqual('required');
        });

        it('Specifying a scenario fetches related rules', function() {
            var m = new core.ValidateModel();
            m.set('name', '');
            m.validation = { name: [{check: 'notEmpty', scenario: 'peach coconut'}, {check: 'required', scenario: 'peach'}] };
            expect(m.getRules(null, 'peach').length).toEqual(2);
            expect(m.getRules(null, 'coconut').length).toEqual(1);
        });

        it('Specifying a scenario fetches generic rules', function() {
            var m = new core.ValidateModel();
            m.set('name', '');
            m.validation = { name: [{check: 'notEmpty'}, {check: 'required', scenario: 'peach'}] };
            expect(m.getRules(null, 'peach').length).toEqual(2);
        });
    });

    describe('Core rules', function() {
        it('Required needs the attribute to be set', function() {
            var m = new core.ValidateModel();
            m.validation = { name: {check: 'required'} };
            var errors = m.validate();
            expect(errors.length).toEqual(1);
            expect(errors[0].attr).toEqual('name');
            expect('value' in errors[0]).toBeTruthy();
            expect(errors[0].msg).toBeDefined();
            expect(errors[0].rule).toEqual('required');
            expect(m.validationErrors).toBeDefined();
            expect(m.validationErrors).toEqual(errors);

            var n = new core.ValidateModel();
            n.set('name', '');
            expect(n.validate()).toEqual(false);
            expect(n.validationErrors).toBeDefined();
            expect(n.validationErrors.length).toEqual(0);
        });

        it('Any rule (but required) considers not set attributes as valid', function() {
            var m = new core.ValidateModel();
            m.validation = { name: {check: 'notEmpty'} };
            expect(m.validate()).toEqual(false);
            expect(m.validationErrors).toBeDefined();
            expect(m.validationErrors.length).toEqual(0);
        });

        it('NotEmpty needs attribute to not be empty', function() {
            var m = new core.ValidateModel();
            m.set('name', '');
            m.validation = { name: {check: 'notEmpty'} };
            var errors = m.validate();
            expect(errors.length).toEqual(1);
            expect(errors[0].attr).toEqual('name');
            expect('value' in errors[0]).toBeTruthy();
            expect(errors[0].msg).toBeDefined();
            expect(errors[0].rule).toEqual('notEmpty');
            expect(m.validationErrors).toBeDefined();
            expect(m.validationErrors).toEqual(errors);

            var n = new core.ValidateModel();
            n.set('name', 'aNotEmptyName');
            m.validation = { name: {check: 'notEmpty'} };
            expect(n.validate()).toEqual(false);
            expect(n.validationErrors).toBeDefined();
            expect(n.validationErrors.length).toEqual(0);
        });

        it('RegExp tests the attribute with the pattern', function() {
            var m = new core.ValidateModel();
            m.set('name', '');
            m.validation = { name: {check: /a/} };
            var errors = m.validate();
            expect(errors.length).toEqual(1);
            expect(errors[0].attr).toEqual('name');
            expect('value' in errors[0]).toBeTruthy();
            expect(errors[0].msg).toBeDefined();
            expect(errors[0].rule).toEqual('regexp');
            expect(m.validationErrors).toBeDefined();
            expect(m.validationErrors).toEqual(errors);

            var n = new core.ValidateModel();
            n.set('name', 'aNotEmptyName');
            m.validation = { name: {check: /a/} };
            expect(n.validate()).toEqual(false);
            expect(n.validationErrors).toBeDefined();
            expect(n.validationErrors.length).toEqual(0);
        });
    });

    describe('Events triggering', function() {
        it('Error events are triggered on validation failures', function() {
            var m = new core.ValidateModel();
            m.set('name', '');
            m.validation = { name: {check: 'notEmpty'} };
            var spyError = sinon.spy();
            m.bind('error:name', spyError);
            m.validate();
            expect(spyError.called).toBeTruthy();
        });
    });
});
