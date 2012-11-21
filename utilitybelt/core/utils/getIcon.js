/**
 * Icon factory functions  
 * @private
 */
core.utils._iconFactory = {
                                     
    /**
     * Returns marker for Google maps
     * There are 10 markers for now, if number > 9, we'll rotate and start from beginning
     * @param {Number} index Markers number
     */
    mapMarker: function(index) {
       
        var markersPath = '/coredesign/images/google_maps/markers/';

        var mapMarkers = [
            'red_MarkerA.png', 
            'blue_MarkerB.png', 
            'green_MarkerC.png', 
            'orange_MarkerD.png', 
            'yellow_MarkerE.png',
            'purple_MarkerF.png',  
            'red_MarkerG.png',  
            'black_MarkerH.png', 
            'brown_MarkerI.png', 
            'white_MarkerJ.png',
            'grey_MarkerK.png'   
        ] 

	var k = (index % mapMarkers.length);
        return markersPath + mapMarkers[k || 0];

    }
}

/**
 * Icon factory dispatcher  
 * @param {String} functionName Function name 
 */
core.utils.getIcon = function(functionName) {
    var fn = core.utils._iconFactory[functionName];
    if (fn) {
        return fn.apply(fn, Array.prototype.slice.call(arguments, 1));
    }
}
