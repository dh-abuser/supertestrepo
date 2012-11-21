/**
* Helper object for tracking events onto analytics services
*/
core.utils.trackingLogger = (function(options) {
    function logTrackingEvent(category, action, label, value) {
        if (typeof _gaq != 'undefined') {
            _gaq.push(['_trackEvent', category, action, label, value]);
        }
        if (typeof ClickTaleTag == "function") {
            ClickTaleTag(category + "_" + action);
        }
    }

    return {
        log: function(category, action, label, value) {
            if (typeof console != 'undefined') {
                console.log(action + ": " + label);
            }
            logTrackingEvent(category, action, label, value);
        },
        logError: function(action, label, value) {
            core.utils.trackingLogger.log("error", action, label, value);
        }
    };
})();
