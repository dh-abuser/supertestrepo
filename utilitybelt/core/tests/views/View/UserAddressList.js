/*
 *  UserAddressCollection Tests
 *
 */

describe("UserAddressListView", function() {

    describe("When instantiated", function() {

        beforeEach(function() {
            this.view = new core.views.UserAddressList({user_id: 1});
        });

        it("should create an element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });

        it("should have a correct class set", function() {
            expect($(this.view.el).hasClass('UserAddressList')).toBeTruthy();
        });

    });

    describe("When instantiated with collection", function() {

        beforeEach(function() {
            this.addr1 = new core.Model(tests.models.address1);
            this.addr2 = new core.Model(tests.models.address2);
            this.collection = new core.collections.Address([
                this.addr1, this.addr2
            ]);
            this.view = new core.views.UserAddressList({
                collection: this.collection,
                user_id: 1
            });
            this.collection.bindTo(this.view);
        });

        it("should create a view", function() {
            expect(this.view).toBeDefined();
        });

        it("should have collection set correctly", function() {
            expect(this.view.collection.length).toEqual(this.collection.length);
        });

        it("re-renders view after the collection has been updated", function() {
            spyOn(this.view, 'render');
            this.view.collection.reset();
            expect(this.view.render).toHaveBeenCalled();
        });

        it("should display an empty message when collection is empty", function() {
            this.view.collection.reset();
            expect(this.view.$el.html()!='').toBeTruthy();
            expect(this.view.$el.html() == jsGetText("no_addresses")).toBeTruthy();
        });

        it('calls to editAddress method when click and it call to openEditWidget', function() {
            var view = this.view;

            spyOn(view, 'editAddress');
            view.delegateEvents();

            view.render();

            $($(view.$el.find('a.edit-icon')[0])).trigger('click');

            expect(this.view.editAddress).toHaveBeenCalled();
        });

        it('calls to deleteAddressConfirm method when click on delete and it shows the confirm panel', function() {
            var view = this.view;

            spyOn(view, 'deleteAddressConfirm');
            view.delegateEvents();

            view.render();

            $($(view.$el.find('a.delete-icon')[0])).trigger('click');

            expect(this.view.deleteAddressConfirm).toHaveBeenCalled();
        });
       
        it('after call to deleteAddressConfirm it shows the confirm panel', function() {
            this.view.render();
            var target = $($(this.view.$el.find('a.delete-icon')[0]));
            target.id = 1;
            this.view.deleteAddressConfirm({ target: target });
            expect(this.view.$el.find('.message')).toExist();
            expect(this.view.$el.find('.yes')).toExist();
            expect(this.view.$el.find('.no')).toExist();
        });

        describe("When address collection changes", function() {

            beforeEach(function() {
              spyOn(this.view, 'render');
              this.view.collection.remove(this.addr1);
            });

            it("should update the collection accordingly", function() {
                expect(this.view.collection.length).toEqual(1);
                expect(this.view.collection.get(this.addr1.id)).toBeFalsy();
            });
          
            it("should re-render (call render again)", function() {
                this.view.collection.trigger('change');
                expect(this.view.render).toHaveBeenCalled();
            });

        });

       describe("When user click on edit icon", function() {

            beforeEach(function() {
                this.view.render();
            });

        });

    });

});