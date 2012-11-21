/**
 * Core class utils
 */
core.Class = {
    define: function(className, definition) {
        if (definition.extend) {
            core.Class.defineSubClass(className, definition);
        } else {
            eval(className + ' = definition');
        }
    },
    defineSubClass: function(className, definition) {
        // ref to parent class
        var parent = eval(definition.extend);
        // get parent mixins to include in definition
        var parentMixins = parent.prototype.mixins || [];
        // prepare augmented definition
        var fullDef = _.extend({}, definition);
        _.each(fullDef.mixins, function(mixin) {
            _.extend(fullDef, eval(mixin));
        });
        fullDef.mixins = parentMixins.concat(fullDef.mixins || []);
        // set the className and namespace
        fullDef.className = className.substring(className.lastIndexOf('.')+1);
        fullDef.self = className;
        // ref to parent prototype allowing easy parent members calling
        fullDef.parent = parent.prototype;
        // define the class and insert it in its namespace
        var klass = parent.extend(fullDef);
        eval(className + ' = klass');
    },
    instantiate: function(className, args) {
        var klass = eval(className);
        var obj = new klass(args);
        return obj;
    },
    getClass: function(className) {
        eval ('var klass = ' + className);
        return klass;
    }
    /*,
    callParent: function(obj) {

        try {
            eval('var parent = ' + obj.self + '.__super__');  // TODO: core.callParent(this) -> this.callParent();

            var fn;
            for (var field in obj) {
                if (obj[field] == arguments.callee.caller) {
                    fn = field;
                }
            }
            parent[fn].call(obj, Array.prototype.slice.call(arguments, 1));
        }
        catch (ex) {
            console.error('Cannot invoke super method', obj.self, ex);
        }
    }*/
};

core.define = core.Class.define;
core.instantiate = core.Class.instantiate;
//core.callParent = core.Class.callParent;
