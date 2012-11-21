/**
 * Object utils
 */
core.utils.object = {

    /** Allows get object property using string as a path:
     *  var foo = { bar: { boo: 'bam' } };
     *  core.utils.object.getByPath( foo, 'bar.boo' ) -> 'bam'
     */
    getByPath: function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in o) {
                o = o[n];
            } else {
                return;
            }
        }
        return o;
    }
}