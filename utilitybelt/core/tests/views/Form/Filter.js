describe("core.views.FilterForm", function() {

    beforeEach(function() {

        $('section.filter').remove();
        $('body').append('<section class="filter"></section>');
        $.fx.off = true;
        spyOn(core.views.FilterForm.prototype, 'render').andCallThrough();
        this.filter = new core.views.FilterForm({
            categories: new core.collections.Category([
                    {name: 'pizza'},
                    {name: 'fast-food'},
                    {name: 'asian'},
                    {name: 'sushi'},
                    {name: 'indian'},
                    {name: 'mediterran'},
                    {name: 'oriental'},
                    {name: 'gourmet'},
                    {name: 'international'}
            ]),
            options: new core.collections.Option([
                    {name: 'online_payment'},
                    {name: 'box'}
            ]),
            el: 'section.filter'
        });
    });

    describe("on instantiation", function() {
        it("should load template and call render method", function() {
            expect(this.filter.render).toHaveBeenCalled();
        });
    });

    describe("when rendered", function() {
        beforeEach(function() {
                    $.cookie('showFilter', null);
        });
        it("should render categories as form inputs", function() {
            expect(this.filter.$('input.category:checkbox').length).toEqual(this.filter.categoriesCollection.length);
        });
        it("should render options as form inputs", function() {
            expect(this.filter.$('input:checkbox').not('.category, .filter-category-select-all').length).toEqual(this.filter.optionsCollection.length);
        });
        it("should replace language placeholders with translated string", function() {
            
            this.filter.categoriesCollection.each( function(cat) {
                expect(this.filter.$('label[for=' + cat.get('name') + ']').text()).toEqual(jsGetText(cat.get('name')));
            }, this);
            this.filter.optionsCollection.each( function(opt) {
                expect(this.filter.$('label[for="category-' + opt.get('name') + '"]').text()).toEqual(jsGetText(opt.get('name')));
            }, this);

            expect(this.filter.$('.hideshow .label').text()).toEqual(jsGetText('hide_filter'));
            expect(this.filter.$('.span-8 b').text()).toEqual(jsGetText('categories'));
            expect(this.filter.$('.span-3 b').text()).toEqual(jsGetText('options'));
            expect(this.filter.$('label[for=all]').text()).toEqual(jsGetText('select_all'));
        });

        describe("if $.cookie('showFilter) === 'false'", function() {
            beforeEach(function() {
                $.cookie('showFilter', false);
                this.filter = new core.views.FilterForm({
                    categories: new core.collections.Category([
                            {name: 'pizza'},
                            {name: 'fast-food'},
                            {name: 'asian'},
                            {name: 'sushi'},
                            {name: 'indian'},
                            {name: 'mediterran'},
                            {name: 'oriental'},
                            {name: 'gourmet'},
                            {name: 'international'}
                    ]),
                    options: new core.collections.Option([
                            {name: 'online_payment'},
                            {name: 'box'}
                    ]),
                    el: 'section.filter'
                });                
            });
            
            it("should hide the filter widget", function() {
                expect(this.filter.$('.body-filter')).toBeHidden();
            });

            afterEach(function() {
                $.cookie('showFilter', null);
            })
        });
        
        describe("if $.cookie('showFilter) === 'true'", function() {
            beforeEach(function() {
                $.cookie('showFilter', true);
                this.filter = new core.views.FilterForm({
                    categories: new core.collections.Category([
                            {name: 'pizza'},
                            {name: 'fast-food'},
                            {name: 'asian'},
                            {name: 'sushi'},
                            {name: 'indian'},
                            {name: 'mediterran'},
                            {name: 'oriental'},
                            {name: 'gourmet'},
                            {name: 'international'}
                    ]),
                    options: new core.collections.Option([
                            {name: 'online_payment'},
                            {name: 'box'}
                    ]),
                    el: 'section.filter'
                });                
            });
            
            it("should hide the filter widget", function() {
                expect(this.filter.$('.body-filter')).toBeVisible();
            });

            afterEach(function() {
                $.cookie('showFilter', null);
            })
        });

    });
    
    describe("when update button receives click event", function() {
        beforeEach(function() {
           spyOn(core.views.FilterForm.prototype, "submit");
           this.filter.$("input[type=checkbox]")[0].click();
           this.filter.$("input[type=checkbox]")[1].click();
           this.filter.$("input[type=checkbox]")[2].click();
           this.filter.$("input[type=checkbox]").not('.category, .filter-category-select-all')[0].click();                      
           this.filter.submit();
        });
        
        it("should call the submit method", function() {
            expect(this.filter.submit).toHaveBeenCalled();
        });
        
        it("getSelected should match checked inputs", function() {
            var selectedCategories = []
                selectedOptions = [];
                
            _.each(this.filter.$("input[type=checkbox].category:checked"), function(input) {
                selectedCategories.push($(input).attr('name'));
            }); 
            expect(selectedCategories).toEqual(this.filter.getSelected().categories);

            _.each(this.filter.$("input[type=checkbox]:checked").not(".category, .filter-category-select-all"), function(opt) {
                selectedOptions.push($(opt).attr('name'));
            });
            expect(selectedOptions).toEqual(this.filter.getSelected().options);
        });

        it("should generate correct URL", function() {
             var selectedCategories = []
                    selectedOptions = [];


            var url = this.filter.buildUrl();
            
            var params = core.utils.getUrlParams(url);

            // Grab the categories
            var catsString  = params.categories || '';
            var categories  = catsString.split(',');

            // Delete categories from params hash
            delete params.categories;
            
            _.each(this.filter.$("input[type=checkbox].category:checked"), function(input) {
                selectedCategories.push($(input).attr('name'));
            }); 

            expect(selectedCategories).toEqual(categories);
            
            _.each(this.filter.$("input[type=checkbox]:checked").not(".category, .filter-category-select-all"), function(opt) {
                selectedOptions.push($(opt).attr('name'));
            });
            
            var options = [];
            _.each(params, function(param, key) {
                options.push(key);
            })
            
            expect(selectedOptions).toEqual(options);
            expect(url).toEqual(window.location.href.split("?")[0] + "?categories=" + selectedCategories.join(',') + '&' + options[0] + '=' + params[options[0]]);
        });

    });
    
    afterEach(function() {
        $('section.filter').remove();
    });


});