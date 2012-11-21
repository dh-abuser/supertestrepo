/**
 * Get the current URL Hash 
 * @returns {String} String Representation of Hash 
 */
core.utils.getUrlHash = function() {
    var hash = window.location.hash;
    // Normalisation fix for cross browser implementation discrepancies 
    if (hash.indexOf('#') === 0) { hash = hash.substring(0, hash.length); }
    
    return hash;
    
};