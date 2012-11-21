/**
 * Validate Mixin.
 * Implements core mechanisms for validation.
 */
core.define('core.mixins.Validate', {

    /**
     * Property describing the validation scheme, e.g.:
     *
     * validation: {
     *   name: {
     *     check: 'required',
     *     msg: 'name is required'
     *   },
     *   age: [{
     *     check: function(value) { return value > 0 && value < 100 },
     *     scenario: 'save'
     *   }, {
     *     check: 'notEmpty'
     *   }]
     * }
     */

    validationRules: _.extend({}, {
        regexp: function(val, pattern) {
            return pattern.test(val);
        },
        notEmpty: function(val) {
            return !(val === '' || _.isUndefined(val) || _.isNull(val));
        },
        required: function(val) {
            return !(_.isUndefined(val) || _.isNull(val));
        },
        email: function(val) {
            var pattern = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
            return pattern.test(val);
        }
    }),


    /**
     * Provides a default validate definition.
     * The return value is Backbone-compliant: it returns validation errors.
     * @param {Array} attributes The list of attributes to validate (defaults to all attributes)
     * @param {Object} options A hash that can hold the scenario information
     * @return {mixed} false if no validation error, an array of validation errors otherwise
     */
    validate: function(attributes, options) {
        attributes || (attributes = this.attributes);
        var opts = _.extend({scenario: this.scenario || ''}, options),
            self = this;
        this.validationErrors = [];
        var rules = this.getRules(attributes, opts.scenario);
        var failures = this.applyRules(attributes, rules);
        if (failures.length) {
            this.validationErrors = failures;
            _.each(failures, function(failure) {
                self.trigger('error:'  + failure.attr, self, failure, options);
            });
        }
        return failures.length ? failures : false;
    },

    /**
     * Overwrites Backobne.isValid() to check if the model has
     * validation errors or not.
     * @return Boolean True if the model is valid, false otherwise
     */
    isValid: function() {
        return !this.validationErrors || !this.validationErrors.length;
    },

    /**
     * Gets the rule set for given attributes and scenario.
     * Flatten the rules: every entry holds its attribute name
     * (instead of lying in a parent object).
     * @param {Array} attributes The list of attributes to be validated
     * @param {String} scenario The scenario to filter the rules
     * @return {Array} A flat array of validation rules
     *
     * TODO handle attribute-wide scenario
     */
    getRules: function(attributes, scenario) {
        var activeRules = [];
        _.each(this.validation, function(ruleSet, attr) {
            _.isArray(ruleSet) || (ruleSet = [ruleSet]);
            _.each(ruleSet, function(rule) {
                if (!rule.scenario || rule.scenario.indexOf(scenario) > -1) {
                    activeRules.push(_.extend({attr: attr}, rule));
                }
            });
        });
        return activeRules;
    },

    /**
     * Applies a rule set by creating validators, running them
     * and returning the failures.
     * @param {Object} attributes The hash of attributes + values to validate
     * @param {Array} rules A flat array of validation rules
     * @return {Array} An array of unverified rules
     */
    applyRules: function(attributes, rules) {
        var invalids = [];
        for (var r=0, bound=rules.length; r<bound; r++) {
            var value = attributes[rules[r].attr];
            var validator = this.mkValidator(value, rules[r]);
            if (!validator.check()) {
                invalids.push(validator);
            }
        }
        return invalids;
    },

    /**
     * Makes a validator for a given rule.
     * A validator is an object which knows the rule details
     * and which has a check method, which is the rule ready
     * to be fired (using a partial).
     * @param {Object} rule The rule which the validator is built on
     * @param {mixed} value The value of the attribute to validate
     * @return {Object} An object having validation infos and check method
     */
    mkValidator: function(value, rule) {
        var check = rule.check,
            fn;
        if (_.isFunction(check)) {
            fn = _.bind(check, this, value);
        } else {
            // if the check is a reg exp, extend the rule definition
            !_.isRegExp(check) || (check = ['regexp', check]);
            // if the check is a string, extend the definition
            _.isArray(check) || (check = [check]);
            // elements after first are used as args
            var args = check.slice(1);
            // first element is the name of the rule
            check = check.shift();
            // prepare a partial function bound to "this"
            var _fn = _.bind(this.validationRules[check], this, value),
                _pass = 'required' != check && (_.isUndefined(value) || _.isNull(value));
            fn = function() { return _pass || _fn.apply(this, args); };
        }
        return {
            attr: rule.attr,
            value: value,
            msg: rule.msg || '',
            check: fn,
            rule: rule.name || _.isString(check) ? check : ''
        };
    }
});
