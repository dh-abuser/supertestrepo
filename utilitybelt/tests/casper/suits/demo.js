casper.then(function(){
    this.fill('form.big_input', { location: '2000' });
});

casper.then(function(){
    this.wait(300);
    this.click('input.button');
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    })
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/' + 'demo.png');
});
