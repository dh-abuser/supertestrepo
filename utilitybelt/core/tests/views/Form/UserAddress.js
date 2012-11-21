describe("core.views.UserAddressForm", function() {

    describe("When instantiated without predefined data", function() {

        beforeEach(function() {
            this.view = new core.views.UserAddressForm({ id: 1, user_id: 1 });
        });

        it("should create an element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });

        it("should assign id, user_id and model", function() {
            expect(this.view.id).toEqual(1);
            expect(this.view.user_id).toEqual(1);
            expect(this.view.model).toBeDefined();
            expect(this.view.model.self).toEqual('core.models.Address');
        });

    });
        
    describe("When rendered", function() {
          
        beforeEach(function() {
            this.view = new core.views.UserAddressForm();
        });

        it("should render a form element", function() {
            var $el = $(this.view.el);
            this.view.on('render', function() {
                expect($el.find('form')).toExist();  
            })
        });
        
        it("should render a submit button", function() {
            var $el = $(this.view.el);
            this.view.on('render', function() {
                expect($el.find('a.button')).toExist();
            })
        });

    });
          
    describe('When formSubmit function is called', function() {

        beforeEach(function() {
            this.view = new core.views.UserAddressForm({ id: 1, user_id: 1 });
        });

/*
        it('submits the form', function(){
            var view = this.view;

            waitsFor( function() {
                return view.rendered;
            }, 'View is not rendered', 1000)

            runs( function() {
                spyOn(view, 'formValidate');
                view.$el.find('form .submit').trigger('click');
                expect(view.formValidate).toHaveBeenCalled();
            } );

        });
*/

        it('calls UserAddressModel validate method', function(){
            spyOn(this.view.model, 'validate');
            this.view.formValidate();
            expect(this.view.model.validate).toHaveBeenCalled();
        });

    });
         
});
