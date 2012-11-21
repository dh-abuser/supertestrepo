core.utils.formatAddress = function(addressObject, mode) {
    if (addressObject == null) {
        return "";
    }
    if (APP_LANGUAGE.toLowerCase() == "au") {
        if (mode == 'full') {
            return addressObject.suburb + ' ' + (addressObject.zipcode || '')  + ', ' + addressObject.state;
        }
        else {
            return addressObject.suburb;
        }
    } 
    else {
        return addressObject.street_name + " " + addressObject.street_number;
    }
}
