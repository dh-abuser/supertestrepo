
/**
 * GetText utility for basic i18n implementation
 * Supports sprintf format for messages
 * @param {String} key message key
 */
core.utils.getText = function(key) {
    var value, args = Array.prototype.slice.call(arguments, 1);
    try {
        value = core.messages[APP_LANGUAGE][key];
    }
    catch (ex) {
        value = key;
        console.error('Cannot find the message with key "' + key + '"');
    }

    if (typeof value == 'string') {
        try {
            return _.str.sprintf.apply(_.str.sprintf, [value].concat(args));
        }
        catch (ex) {
            console.error(ex, '\nWrong message: ' + value);
            return value;
        }
    }
    else if (typeof value == 'undefined') {
        console.error('Cannot find the message with key "' + key + '"');
        return key;
    }
    else {
        return value.apply(value, args);
    }
};

var jsGetText = core.utils.getText;
