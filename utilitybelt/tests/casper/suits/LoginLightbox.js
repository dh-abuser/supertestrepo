
//define fixtures and selectors here

var fixtures = {
    "email": "",
    "pwd": ""
}

var pieces = {
    trigger: '#demo > a.button',
    box: '.lightbox',
    loginForm: '.LoginForm form',
    idField: 'input[name=email]',
    pwdField: 'input[name=pwd]',
    submitter: 'a.submit'
};

var counter = 0;

function takePicture(suffix) {
    casper.capture(screenshotsPath + '/login-form-' + (++counter) + '-' + suffix + '.png');
}

casper.then(function() {
    this.test.assert(this.visible(pieces.trigger), 'A link to show the login widget exists');
});

casper.then(function() {
    this.click(pieces.trigger);
    casper.echo('Click on button to show the widget');
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    });
});

casper.then(function() {
    this.test.assert(this.visible(pieces.box), 'Login widget is visible');
    this.test.assert(this.visible(pieces.loginForm), 'Login form is visible');
    this.test.assert(this.visible(pieces.idField), 'Login id form input is visible');
    this.test.assert(this.visible(pieces.pwdField), 'Login password form input is visible');
    this.test.assert(this.visible(pieces.submitter), 'Login form submit is visible');
});

casper.then(function() {
    this.echo('taking photo', 'INFO');
    takePicture('login-widget-visible');
});

/**
 * UC 1. Submitting form with empty inputs
 */
casper.then(function() {
    this.fill(pieces.loginForm, {
        'email': '',
        'pwd': ''
    });
    this.click(pieces.submitter);
    casper.echo('Click on login button');
    this.wait(500, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function() {
	this.echo('taking photo', 'INFO');
    takePicture('empty-inputs');
});

casper.then(function() {
    this.test.assert(this.visible(pieces.loginForm + ' .input-error'), 'Login form inputs marked as erroneous');
});
