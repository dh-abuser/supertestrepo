core.utils.redirectLocation = function(options) {
    var location = options.address || options.get('address');
    if (APP_LANGUAGE.toLowerCase() == "au") {
        window.location.href = core.utils.formatURL("/" + core.utils.slugifyPart(location.city) + "/" + core.utils.slugifyPart(location.suburb) + "/");
    } else {
        window.location.href = core.utils.formatURL("/search/" + location.latitude + "/" + location.longitude);
    }
}

core.utils.slugifyPart = function(part) {
    return part.replace(/\s+/g, '-').toLowerCase()
}

core.utils.redirectRestaurant = function(restaurantSlug, location){
    var address = location.address || location.get('address');
    core.runtime.persist('active_address', address, true);
    window.location.href = core.utils.formatURL("/" + core.utils.slugifyPart(address.city) + "/" + restaurantSlug + "/");
}
