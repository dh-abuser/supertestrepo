/*
 * Builds a URL from provided parts or from existing URL if none supplied
 *
 * @param {Object} object containing GET parameters.
 * @param {String} URL origin (e.g. http://www.google.com) - defaults to window.location.orgin if none supplied.
 * @param {String} URL path (e.g. /controller/action/1) - defaults to window.location.pathname if none supplied.
 * @param {String} URL hash (e.g. #iamahash) - defaults to window.location.hash (via core.utils.getUrlHash wrapper)
 *
 *      Example:
 *          
 *          var url = core.utils.buildUrl({categories: 'cat1, cat2, cat3', option1: 'on', option2: 'on}, 'http://www.google.com', '/controller/action/1', '#iamahash');
 *
 */
 
 core.utils.buildUrl = function(params, origin, pathname, hash) {

    var paramString, url, i;
    
    // Patch window.location.origin if it doesn't exist.
    if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.host;
    
    origin      = origin    || window.location.origin;
    pathname    = pathname  || window.location.pathname;
    hash        = hash      || core.utils.getUrlHash();

    paramString = '';
    i           = 0;
    
    // TODO refactor without Underscore dependency
    _.each(params, function(param, key) {
        if(null != param && '' != param) {
            paramString += (i > 0 ? '&' : '?') + key + "=" + param;
            i++;
        }
    });
    
    url = origin + pathname + paramString + hash;
    
    return url;
    
}