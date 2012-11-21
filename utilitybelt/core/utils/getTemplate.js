/**
 * Loads template and apply the given callback.
 * Supports asynchronous loading.
 * @param {Array} names The template file names (relative to /js/core/templates)
 * @param {Function} callback The callback to be run on the loaded templates
 */
core.utils.getTemplate = function(names, callback) {
    var path = 'core/templates/',
        toLoad = [],
        loaded = [];

    if (typeof names == 'string') {
        names = [names];
    }
    _.each(names, function(name, i) {
        if (name in core.templates) {
            loaded[i] = core.templates[name];
        } else {
            toLoad.push('template!' + path + name);
        }
    });

    if (toLoad.length) {
        require(toLoad, function() {
            _.each(arguments, function(tpl, i) {
                var name = tpl.name.replace(path, '');
                var j = _.indexOf(names, name);
                loaded[j] = tpl.content;
            });
            applyCallback(loaded);
        });
    } else {
        applyCallback(loaded);
    }

    /**
     * Applies the callback to all templates.
     * @param {Array} templates The loaded templates
     */
    function applyCallback (templates) {
        callback.apply(this, templates);
    }
};
