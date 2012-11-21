/*
 *  UserAddressModel Tests
 *
 */
describe("core.models.Address", function() {    

    describe("When initialized", function() {

        beforeEach(function() {
           this.record = new core.models.Address({ user_id: 1, id: 100 });
        });
        
        it("UserAddressModel is empty", function() {
            expect(this.record).toBeTruthy();
            expect(this.record.attributes).toBeDefined();
        });
    
        describe("Basic properties", function() {
            it("Extends the core.Model and has its basic methods", function() {
                var mdl_class = core.models.Address;
                var rec = new mdl_class();
                expect(mdl_class.__super__.self).toEqual('core.Model');
                expect(rec.fetch).toBeDefined();
                expect(rec.save).toBeDefined();
                expect(rec.destroy).toBeDefined();
            });
        });                       
                
/*
        describe('Needs to be initialized with user_id attribute provided', function(){
            it('Has attribute user_id', function(){
                expect(this.record.get('user_id')).toBeDefined();
            });
            it('Throws an exception if user_id is not provided', function(){
                var test = this.record;

                expect(function(){test.requiredParams();}).toThrow(new Error('UserAddressModel user_id not provided'));
            });
            
            it('Throws an exception if user_id is not integer', function(){
                this.record.set('user_id', 'string');
                var test = this.record;
                expect(function(){test.requiredParams();}).toThrow(new Error('UserAddressModel user_id wrong type'));
            });
        });
    
    });
    
    describe('When called with required user_id parameter', function(){
        
        beforeEach(function() {
            this.record = new website.models.UserAddressModel({user_id:2});
        });
        
        describe('Forms url based on user_id and id parameters', function(){
             it('Formats url to fetch data from server properly', function(){
                this.record.set({'id':1, 'user_id':2});
                expect(this.record.url()).toEqual('/users/2/addresses/1/');
             });
             
             it('Formats url to send save request for new model to server properly', function(){
                    this.record.set({'user_id':2});
                    expect(this.record.url()).toEqual('/users/2/addresses/');
                 });
        });
*/        

        describe('Data are parsed appropriately between API and frontend', function(){
                      
            describe('When data from backend API are fetched', function(){

                beforeEach(function(){
                    this.server = sinon.fakeServer.create();   
                    this.server.respondWith(
                            "GET",
                            "/users/1/addresses/100/",
                            [
                              200,
                              {"Content-Type": "application/json"},
                              '{"response": ' + JSON.stringify(tests.models.exampleAPIResponse) + '}'
                            ]
                          );
                    this.record.set({'id':100, 'user_id':1});
                   
                });
                
                it('sends appropriate request to server', function(){
                    var request = this.record.fetch();
                    expect(this.server.requests.length).toEqual(1);
                    expect(this.server.requests[0].method).toEqual("GET");
//                    expect(this.server.requests[0].url).toEqual("/users/1/addresses/100/");
                });

                it('parses data to transform them to format appropriate for Backbone model', function(){
                    var request = this.record.fetch();
                    this.server.respond();  
                    expect(this.record.attributes).toEqual(tests.models.exampleModelData);
                });
                
                afterEach(function(){
                    this.server.restore();
                });
            });
            
            it('Model parse() method returns appropriate response', function(){
                var mockServerResponse = {response: tests.models.exampleAPIResponse};
                var parsed = this.record.parse(mockServerResponse);
                expect(parsed).toEqual(tests.models.exampleModelData);
            });
            
            describe('When model data are sent to backend API', function(){
                it('formats JSON as expected by backend API', function(){
                    this.record.set(tests.models.exampleModelData);
                    var result = this.record.toJSON();
                    expect(result).toEqual(tests.models.exampleUpdateRequest);
                });
            });

        });
    });
});