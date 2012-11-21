/**
 * Formats a URL to the given endpoint 
 * @param {String} relative URL
 * @return {String}  
 */
core.utils.formatURL = function (url){
    var rootPath = '/happy';

    var urlPrefix = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port !== '') {
    	urlPrefix += ":" + window.location.port;
    }
    
    if (!lh_data.global_path_prefix)
        rootPath = lh_data.global_path_prefix;
    return urlPrefix + rootPath + url;
    
}
