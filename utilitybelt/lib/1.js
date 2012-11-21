var URL_utils = BaseClass.extend({
    redirectIfExists: function(data, searchForUrl) {
        var found;
        // for (field in data) {
        for (field in data.urls) {
            debug;
            if (data.urls[field] == searchForUrl)
                found = data.urls[field];
        }    
        window.location.href = found;
        console.log('redirected to ' + found);
        // return found;
    }
})