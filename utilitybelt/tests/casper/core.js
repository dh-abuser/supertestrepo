
var logPath = 'logs';
var suitsPath = 'suits';
var screenshotsPath = 'output';

phantom.injectJs('config.js');

var casper = require('casper').create( { 
    viewportSize: { width: 1200, height: 800 },
    clientScripts: ["jquery.min.js"] 
});

if (casper.cli.has(0)){
    var testName = casper.cli.get(0);
} else {
    casper.echo('You have to provide a test name or folder name');
    casper.die('No test file or folder name provided');
};

if (casper.cli.has(1)) {
    var url = casper.cli.get(1);
} else {
    casper.echo('You have to provide a valid url');
    casper.die('No url provided');
};

if (casper.cli.has(2)) {
    var logFile = casper.cli.get(2);
} else {
    var logFile = testName + '.xml';
};

casper.echo('casper will now try to enter provided address: ' + url);

casper.start(url);

casper.then(function(){        
    this.echo('entered webpage: ' + url, 'INFO');
    this.wait(300, function() {
        this.echo("I've waited a bit");
    });
});

/*
casper.nextScreenshot = function() {
};
*/

casper.evaluate(function(some) {
    some.echo(111)
})

phantom.injectJs(suitsPath + '/' + testName);

casper.run(function() {
    this.test.renderResults(true, 0, logPath + '/' + logFile);
    this.exit(); 
});
