/*! http://mths.be/placeholder v1.8.5 by @mathias */
;(function(window, document, jQuery) {

	var isInputSupported = 'placeholder' in document.createElement('input'),
	    isTextareaSupported = 'placeholder' in document.createElement('textarea');

	if (isInputSupported && isTextareaSupported) {

		jQuery.fn.placeholder = function() {
			return this;
		};

		jQuery.fn.placeholder.input = jQuery.fn.placeholder.textarea = true;

	} else {

		jQuery.fn.placeholder = function() {
			return this.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.bind('focus.placeholder', clearPlaceholder)
				.bind('blur.placeholder', setPlaceholder)
				.bind('focusout.placeholder', setPlaceholder)
				.trigger('blur.placeholder').end();
		};

		jQuery.fn.placeholder.input = isInputSupported;
		jQuery.fn.placeholder.textarea = isTextareaSupported;

		jQuery(function() {
			// Look for forms
			jQuery('form').bind('submit.placeholder', function() {
				// Clear the placeholder values so they don’t get submitted
				var $inputs = jQuery('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		jQuery(window).bind('unload.placeholder', function() {
			jQuery('.placeholder').val('');
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
		    rinlinejQuery = /^jQuery\d+$/;
		jQuery.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder() {
		var $input = jQuery(this);
		if ($input.val() === $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input.hide().next().show().focus().attr('id', $input.removeAttr('id').data('placeholder-id'));
			} else {
				$input.val('').removeClass('placeholder');
			}
		}
	}

	function setPlaceholder() {
		var $replacement,
		    $input = jQuery(this),
		    $origInput = $input,
		    id = this.id;
		if ($input.val() === '' || $input.val() == $input.attr('placeholder')) {
			if ($input.is(':password')) {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = jQuery('<input>').attr(jQuery.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						// We could just use the `.data(obj)` syntax here, but that wouldn’t work in pre-1.4.3 jQueries
						.data('placeholder-password', true)
						.data('placeholder-id', id)
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data('placeholder-textinput', $replacement)
						.data('placeholder-id', id)
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
			}
			$input.addClass('placeholder').val($input.attr('placeholder'));
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, jQuery));

jQuery(function() { 
    jQuery('input, textarea').placeholder();
});

/*
jQuery(document).ready(function() {
				jQuery('input[placeholder], textarea[placeholder]').placeholder();
});
*/