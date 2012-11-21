
/** 
* Address Form, appears on the Home page 
* @param {String} template Template code
*/

lh.widgets.Address = core.views.Form.extend({
    className: "Address",
    type: 'post',

/* Render widget */

    render: function() {
        this.el.html(_.template(this.template));
        lh.widgets.Address.__super__.render.call(this);
    },
    
/* @constructor */

    initialize: function() {
        this.el = $(this.el);
        this.model = this.options.model || new lh.models.Address();
        this.defaults = this.options.defaults || this.model.defaults;

        /* Select first field when rendered */

        this.bind('show', this.selectFirstField);

        this.render();

        /* Bind tooltip to the question link */

        $('.question_address', this.el).click( 
            function(event) {
                var tooltip = new lh.core.widgets.Tooltip({ el: $('.tooltip_address'), click_event: event, anchor: $(this) });
            }
        );

        /* Create field labels from Model with error message containers */

        if (this.model) {
            var fields = this.model.fields;
            for (var i=0, ii=fields.length; i<ii; i++) {
                var field_name = fields[i].name;
                var $field = $('input[name="' + field_name + '"]', this.el);
                $field.val(this.defaults[field_name]);
                $field.prev('label').after('<div class="error_message"></div>');
            }
        }

        this.options.success = this.success;
        lh.widgets.Address.__super__.initialize.call(this);
    },

/* Widget template */

    template: '<form class="big_input">' +
                   '<fieldset>' +
                       '<div class="margin_10">' +
                           '<label>{{ jsGetText("form_street_label") }}</label>' +
                           '<input type="text" class="strasse" placeholder="{{ jsGetText("form_street_placeholder") }}" name="street" tabindex="1" />' +
                           '<div class="question_address">{{ jsGetText("question_address_tooltip") }}</div>' +
                           '<div class="tooltip_address" style="display:none;">' +
                               '<div class="top_tooltip"></div>' +
                               '<div class="body_tooltip">{{ jsGetText("question_address_tooltip_body") }}</div>' +
                               '<div class="footer_tooltip"></div>' +
                           '</div>' +
                           '<div class="clear"></div>' +
                       '</div>' +
                       '<div class="margin_10">' +
                           '<label>{{ jsGetText("form_zip_label") }}</label>' +
                           '<input type="text" class="float_left box_shadow zipcode_or_city" placeholder="{{ jsGetText("form_zip_placeholder") }}" name="zipcode_or_city" tabindex="2" />' +
                       '</div>' +
                       '<img class="float_right spinner" src="/images/spinner.gif" alt="spinner" style="display:none;">' +
                       '<input class="green_big submit float_left" type="submit" value="{{ jsGetText("form_address_button") }}" tabindex="3" />' +
                   '</fieldset>' +
              '</form>',

/* Success callback */

    success: function(data) {
        this.hideSpinner();
        if (data.results) {
            if (data.results.length > 1) {

                /* Open Google map widget when multiple addresses */

                var suggestion_window = new lh.widgets.MultipleChoiceMap({
                	el: $('#multiple_choice_address_lightbox'),
                	addresses: data.results });
                suggestion_window.show();
            }
            else {

                /* Redirect to the result page when single result */

                this.showSpinner();
                lh.utils.redirectByAddress(data.results[0]);
            }
        }
        else {

            /* Show error window if there is no results */

            /* TODO: create widget for this kind of LB */
            var error_window = new lh.core.widgets.Lightbox({
            	    el: $('#address_not_found_lightbox'),
            	    events: { 
            	        'click .lightboxSubmit': 'hide'
            	    }
            	});
            	error_window.show();

                /* Focus and select first field after lightbox is closed */

            	$(error_window.el).bind('hide', _.bind(function() {
            	    this.selectFirstField();
            	}, this));
        }
    } 
});
