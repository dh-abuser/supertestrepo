describe("core.collections.ExitPoll", function() {
    beforeEach(function() {
        this.collection = new core.collections.ExitPoll();
    });
    
    describe('When getShuffledOptions method is called', function(){
       it('Should call a _.shuffle method with the collection models', function(){
           this.shuffleSpy = sinon.spy(_, 'shuffle');
           
           this.collection.getShuffledOptions();
           
           expect(this.shuffleSpy.calledWith(this.collection.models)).toBeTruthy();
           
           _.shuffle.restore();
       }); 
    });
    
    describe('When validate method is called with input data', function(){
       it('Should return false when data object is empty', function(){
           var data = {};
           expect(this.collection.validate(data)).not.toBeTruthy();
       });
       
       it('Should return true when data object is not empty', function(){
           var data = { 'a': 'b' };
           expect(this.collection.validate(data)).toBeTruthy();
       });
    });
    
});
