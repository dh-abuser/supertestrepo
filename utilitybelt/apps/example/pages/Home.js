
/** Home page */

example.Home = example.Page.extend({

    initialize: function() {
    
        example.Home.__super__.initialize.call(this);

        $(document).ready(function() {

            console.log('Home page ready');

        });

    }
});