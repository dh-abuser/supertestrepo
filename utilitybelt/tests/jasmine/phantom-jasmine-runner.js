/**
 * Runner for Jasmine tests 
 */

// Namespace "utils.core"
var utils = utils || {};
utils.core = utils.core || {};

var console_colors = {
  'red': '\u001b[31m',
  'blue': '\u001b[34m',
  'green': '\u001B[32m',
  'reset': '\u001b[0m'
}

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param check javascript condition that evaluates to a boolean.
 * @param onTestPass what to do when 'check' condition is fulfilled.
 * @param onTimeout what to do when 'check' condition is not fulfilled and 'timeoutMs' has passed
 * @param timeoutMs the max amount of time to wait. Default value is 3 seconds
 * @param freqMs how frequently to repeat 'check'. Default value is 250 milliseconds
 */
utils.core.waitfor = function(check, onTestPass, onTimeout, timeoutMs, freqMs) {
    var timeoutMs = timeoutMs || 120000,      //< Default Timeout is 120s
        freqMs = freqMs || 1000,             //< Default Freq is 1000ms
        start = Date.now(),
        condition = false,
        timer = setTimeout(function() {
            var elapsedMs = Date.now() - start;
            if ((elapsedMs < timeoutMs) && !condition) {
                // If not time-out yet and condition not yet fulfilled
                condition = check(elapsedMs);
                timer = setTimeout(arguments.callee, freqMs);
            } else {
                clearTimeout(timer); //< house keeping
                if (!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    onTimeout(elapsedMs);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    onTestPass(elapsedMs);
                }
            }
        }, freqMs);
};

var htmlrunner,
    resultdir,
    page,
    fs;

//phantom.injectJs("lib/utils/core.js")

if ( phantom.args.length !== 1 ) {
    console.log("Usage: phantom_test_runner.js HTML_RUNNER");
    phantom.exit();
} else {
    htmlrunner = phantom.args[0];
    page = require("webpage").create();
    fs = require("fs");
    
    // Echo the output of the tests to the Standard Output
    page.onConsoleMessage = function(msg, source, linenumber) {
        console.log(msg);
    };

    page.open(htmlrunner, function(status) {
        if (status === "success") {
            utils.core.waitfor(function() { // wait for this to be true
                return page.evaluate(function() {
                    return (typeof(jasmine)!='undefined' && typeof(jasmine.phantomjsXMLReporterPassed) !== "undefined");
                });
            }, function() { // once done...
                
                // Return the correct exit status and print it to console. '0' only if all the tests passed
                phantom.exit(page.evaluate(function(console_colors){
                    if (jasmine.phantomjsXMLReporterPassed)
                        console.log(console_colors.green + 'PASSED');
                    else
                        console.log(console_colors.red + 'FAILED');
                    return jasmine.phantomjsXMLReporterPassed ? 0 : 1; //< exit(0) is success, exit(1) is failure
                }, console_colors));

            }, function() { // or, once it timesout...
                console.log('timeout, exiting')
                phantom.exit(1);
            });
        } else {
            console.log("phantomjs> Could not load '" + htmlrunner + "'.");
            phantom.exit(1);
        }
    });
}
