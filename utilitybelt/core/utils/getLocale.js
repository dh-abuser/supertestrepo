/*
 * Retrieves locale-specific values
 * @param {String} key The key for the localized value, can be nested ("currency.symbol", for example)
 */

core.utils.getLocale = function(key) {
    var value;
    
    try {
        value = core.utils.object.getByPath(core.locales[APP_LANGUAGE], key);
    } catch (ex) {
        console.error('Cannot find the locale with key "' + key + '"');
    }
    
    if (typeof value == 'undefined') {
        console.error('Cannot find the locale with key "' + key + '"');
        return key;
    } else {
        return value;
    }
}

var jsGetLocale = core.utils.getLocale;

