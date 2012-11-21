/**
 * Get parameters from URL
 * @param {String} String representation of a URL (optional - will act on present URL if not supplied)
 * @returns {Object} Javascript representation of URL params
 */
core.utils.getUrlParams = function(url) {
    var regex, isArray, hash, parts, key, value;
    var params = {};

    url = url || window.location.href;
    regex = /([^=&?]+)=([^&#]*)/g

    while((parts = regex.exec(url)) != null) {
        key = parts[1], value = parts[2];
        isArray = /\[\]$/.test(key);

        if(isArray) {
            params[key] = params[key] || [];
            params[key].push(value);
        }
        else {
            params[key] = value;
        }
    }
    return params;
};