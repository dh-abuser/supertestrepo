describe("core.views.ExitPollForm", function() {
    beforeEach(function() {
        this.deliveryAddress = new core.models.Address();
        this.exitPollCollection = new core.collections.ExitPoll();
    });
    
    describe("When instantiated", function() {
        beforeEach(function() {
            this.getShuffledOptionsSpy = sinon.spy(this.exitPollCollection, 'getShuffledOptions');
            this.getTemplateSpy = sinon.spy(core.utils, 'getTemplate');
            
            this.view = new core.views.ExitPollForm({
                collection: this.exitPollCollection, 
                deliveryAddress: this.deliveryAddress
            });
        });
        
        afterEach(function(){
            this.exitPollCollection.getShuffledOptions.restore();
            core.utils.getTemplate.restore();
        });
        
        it("should create an element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });
        
        it("should call collection.getShuffledOptions()", function(){
            expect(this.getShuffledOptionsSpy.called).toBeTruthy();
        });
        
        it("should call core.utils.getTemplate", function(){
            expect(this.getTemplateSpy.called).toBeTruthy();
        });
    });
    
    describe("When rendered", function(){
        beforeEach(function() {
            this.view = new core.views.ExitPollForm({
                collection: this.exitPollCollection, 
                deliveryAddress: this.deliveryAddress
            });
            
            this.logFirstTimeDisplaySpy = sinon.spy(this.view, 'logFirstTimeDisplay');
            
            this.view.render();
        });
        
        afterEach(function(){
            this.view.logFirstTimeDisplay.restore();
        });
        
        it("Should create a form element", function(){
            var $el = $(this.view.el);
            this.view.on('render', function() {
                expect($el.find('form')).toExist();
            });
        }) ;
       
        it("Should call logFirstTimeDisplay() method", function(){
            expect(this.logFirstTimeDisplaySpy.called).toBeTruthy();
        });
     });
    
    describe("When submit method called", function(){
        beforeEach(function() {
            this.view = new core.views.ExitPollForm({
                collection: this.exitPollCollection, 
                deliveryAddress: this.deliveryAddress
            });
            //mock the hide coming from lightbox
            this.view.options.hide = function(){};
        });
        
        it("Should call collection validate method", function(){
            this.collectionValidateSpy = sinon.spy(this.exitPollCollection, 'validate');
            this.view.submit();
            expect(this.collectionValidateSpy.called).toBeTruthy();
            this.exitPollCollection.validate.restore();
        });
        
        describe("Depending on the result of collection validate method", function(){
           it('Should call send() method if collection validate returns true', function(){
               this.sendSpy = sinon.spy(this.view, 'send');
               this.collectionValidateSpy = sinon.stub(this.exitPollCollection, 'validate', function(){
                   return true;
               });
               this.view.submit();
               expect(this.sendSpy.called).toBeTruthy();
               
               this.view.send.restore();
               this.exitPollCollection.validate.restore();
           });
           
           it('Should call markInvalid() method if collection validate returns false', function(){
               this.markInvalidSpy = sinon.spy(this.view, 'markInvalid');
               this.collectionValidateSpy = sinon.stub(this.exitPollCollection, 'validate', function(){
                   return false;
               });
               this.view.submit();
               expect(this.markInvalidSpy.called).toBeTruthy();
               
               this.view.markInvalid.restore();
               this.exitPollCollection.validate.restore();
           });
        });
    })
    
    describe("When send method called", function(){
        beforeEach(function() {
            this.view = new core.views.ExitPollForm({
                collection: this.exitPollCollection, 
                deliveryAddress: this.deliveryAddress
            });
            //mock the hide coming from lightbox
            this.view.options.hide = function(){};
            
            this.logSendDisplaySpy = sinon.spy(this.view, 'logSendDisplay');
            
            this.view.send();
        });
        
        afterEach(function(){
            this.view.logSendDisplay.restore();
        });
        
        it('Should call the logSendDisplay() method', function(){
            expect(this.logSendDisplaySpy.called).toBeTruthy();
        });
    });
    
    describe("When logFirstTimeDisplay method called", function(){
        beforeEach(function() {
            this.trackingLoggerSpy = sinon.spy(core.utils.trackingLogger, 'log');
            
            this.view = new core.views.ExitPollForm({
                collection: this.exitPollCollection, 
                deliveryAddress: this.deliveryAddress
            });
            
        });
        
        afterEach(function(){
            core.utils.trackingLogger.log.restore();
        });
        
        it('Should call the core.utils.trackingLogger.log method with appropriate data', function(){
            //mock data
            var $el = $(this.view.el);
            $el.html('<input type="radio"/>');
            this.view.options.deliveryAddress.attributes['suburb'] = 'a';
            this.view.options.deliveryAddress.attributes['city'] = 'b';
            
            this.view.logFirstTimeDisplay();
            expect(this.trackingLoggerSpy.calledWith('polls', 'exit_poll_first_find_display', 'a,b', 1)).toBeTruthy();
        });
    });
    
    describe("When logSendDisplay method called", function(){
        beforeEach(function() {
            this.trackingLoggerSpy = sinon.spy(core.utils.trackingLogger, 'log');
            
            this.view = new core.views.ExitPollForm({
                collection: this.exitPollCollection, 
                deliveryAddress: this.deliveryAddress
            });
        });
        
        afterEach(function(){
            core.utils.trackingLogger.log.restore();
        });
        
        it('Should call the core.utils.trackingLogger.log method with appropriate data', function(){
            var $el = $(this.view.el);
            $el.html('<input type="radio" checked="checked" value="c" />');
            this.view.options.deliveryAddress.attributes['suburb'] = 'a';
            this.view.options.deliveryAddress.attributes['city'] = 'b';
            this.view.logSendDisplay();
            expect(this.trackingLoggerSpy.calledWith('polls', 'exit_poll_first_find_submit', 'c', 1)).toBeTruthy();

        });
    });
});
