
//define fixtures and selectors here

var fixtures = {
    "name": "Casper", 
    "lastname": "Friendly ghost", 
    "street_name": "Mohrenstrasse", 
    "zipcode": "10117", 
    "city": "Berlin", 
    "phone": "01717171717", 
    "email": "",
    "street_number": "60"
} 

var fixtures_update = { "name": "Casper" + (Math.random().toString(36).substring(3,6)) };

var pieces = {
        startBtn: '#demo .button',

        userAddressWrapper: '.UserAddressList',
        userAddressItem: '.user-address',
        userAddressListEmptyMesage: '.no_addresses',
        userAddressAddNew: '.lightbox .new-address',
        userAddressName: '.UserAddressList li .name',
        userAddressConfirmMessage: '.UserAddressList ul .message',
        userAddressConfirmYes: '.UserAddressList ul .yes',
        userAddressConfirmNo: '.UserAddressList ul .no',
        
        userAddressForm: '.UserAddressForm',
        userAddressFormForm: '.UserAddressForm form',
        userAddressFormSubmit: '.UserAddressForm .submit'
};

pieces.userAddressEditTool = pieces.userAddressWrapper + ' .name[data-content="' + fixtures.name + '"] ~ .edit-address .edit-icon';
pieces.userAddressDeleteTool = pieces.userAddressWrapper + ' .name[data-content="' + fixtures_update.name + '"] ~ .edit-address .delete-icon';

var counter = 1;

casper.then(function(){        
    this.test.assert(this.visible(pieces.startBtn), 'A link to start User Address Widget exists');
});

/**
 UC 1. User Address List
*/

casper.then(function(){ 
    this.click(pieces.startBtn);
    casper.echo('Click on button');
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function(){
	this.echo('taking photo', 'INFO');
        this.capture(screenshotsPath + '/' + (counter++) + '-address_list_opened.png');
});

casper.then(function(){ 
    this.test.assert(this.visible(pieces.userAddressWrapper), 'User addresses list is rendered and appears after clicking link to start User Adress Widget');
});

/**
 UC2. User Address Create
*/

casper.then(function(){ 
    this.test.assert(this.visible(pieces.userAddressAddNew), '"Add new User" link is rendered');
    this.click(pieces.userAddressAddNew);
    this.wait(300, function() {
        casper.echo('Click on "New User", waited a bit');
    })
});

casper.then(function(){        
    this.test.assert(this.visible(pieces.userAddressForm), 'A User Address Form exists');
    this.wait(300, function() {
        casper.echo('Wait a bit');
    })
});

casper.then(function(){        
    this.test.assert(!this.visible(pieces.userAddressForm + ' input[name="name"][value]'), 'User name field is empty');
});

casper.then(function(){        
    casper.echo('Fill data');
    this.fill(pieces.userAddressFormForm, fixtures);
});

casper.then(function(){
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/2-address_form_data.png');
});

casper.then(function(){        
    this.test.assert(this.visible(pieces.userAddressFormSubmit), 'Submit button is visible');
});

casper.then(function(){        
    this.echo('Submit invalid data (email is empty)', 'INFO');
    this.click(pieces.userAddressFormSubmit);
});

casper.then(function(){
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/3-address_form_invalid.png');
});

casper.then(function(){        
    this.test.assert(this.visible(pieces.userAddressForm), 'Form is still visible');
    this.test.assert(this.visible(pieces.userAddressForm + ' div.input-error input[name="email"]'), 'Email marked as invalid');
});

casper.then(function(){        
    this.echo('Submit valid data', 'INFO');
    this.fill(pieces.userAddressFormForm, { "email": "donn@john.com" });
    this.click(pieces.userAddressFormSubmit);
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function(){        
    this.test.assert(!this.visible(pieces.userAddressForm), 'Form is hidden');
    this.test.assert(this.visible(pieces.userAddressWrapper), 'User addresses list is rendered again');
});

casper.then(function(){
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/4-address_list_after_submit.png');
});

casper.then(function(){
    this.test.assert(this.fetchText(pieces.userAddressName).indexOf(fixtures.name)>=0, 'New user name appeared in the list');
});

casper.then(function(){
    this.test.assert(this.visible(pieces.userAddressEditTool), 'Edit address tool is visible');
});

casper.then(function(){
    this.click(pieces.userAddressEditTool);
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function(){        
    this.fill(pieces.userAddressFormForm, fixtures_update);
});

casper.then(function(){
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/5-address_list_click_edit.png');
});

casper.then(function(){        
    this.click(pieces.userAddressFormSubmit);
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function(){
    this.test.assert(this.fetchText(pieces.userAddressName).indexOf(fixtures_update.name)>=0, 'Updated user name appeared in the list');
});

casper.then(function(){
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/6-address_list_after_edit.png');
});

casper.then(function(){
    this.test.assert(this.visible(pieces.userAddressDeleteTool), 'Delete address tool is visible');
});

casper.then(function(){
    this.click(pieces.userAddressDeleteTool);
    this.wait(300, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function(){
    this.test.assert(this.visible(pieces.userAddressConfirmMessage), 'Confirmation message appear');
    this.test.assert(this.visible(pieces.userAddressConfirmYes), 'Confirmation "yes" button appear');
    this.test.assert(this.visible(pieces.userAddressConfirmNo), 'Confirmation "no" button appear');
    this.click(pieces.userAddressConfirmNo);
    this.test.assert(!this.visible(pieces.userAddressConfirmMessage), 'Confirmation message disappear');
    this.click(pieces.userAddressDeleteTool);
    this.click(pieces.userAddressConfirmYes);
    this.wait(1000, function() {
        casper.echo('Waited a bit');
    })
});

casper.then(function(){
    this.test.assert(!this.visible(pieces.userAddressConfirmMessage), 'Confirmation message disappear');
    this.test.assert(this.fetchText(pieces.userAddressName).indexOf(fixtures_update.name)<0, 'Deleted user name does not appear in the list');
});

casper.then(function(){
    this.echo('taking photo', 'INFO');
    this.capture(screenshotsPath + '/7-address_list_click_delete.png');
});
