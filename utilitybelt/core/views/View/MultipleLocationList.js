/**
 * View for Mulitple Location List
 *
 * Examples:
 *
 * @extends core.View
 */

core.define('core.views.MultipleLocationList', {

	extend : 'core.View',

	template : ['MultipleLocation/MultipleLocationList.html'],

	events : {
		"click li" : "locationSelectHandler"
	},

	className : 'MultipleLocationList',

	/**
	 * Initialize
	 * @method initialize
	 * @constructor
	 * @param {Object} options Options
	 */
	initialize : function(options) {
		this.locations = this.options.locations;
		var me = this;
		var tmpData = {
			locations : this.locations,
			getBackgroundCSS : function(index) {
				return 'background:url("' + core.utils.getIcon('mapMarker', index) + '") 0px 0px no-repeat; padding-left:30px';
			}
		};
		core.utils.getTemplate(this.template, function(tpl) {
			me.template = _.template(tpl)(tmpData);
			me.render();
		});
	},

	render : function(tpl) {
		this.rendered = true;
		this.$el = $(this.template);
		this.el = this.$el[0];
		this.delegateEvents();
	},
	/**
	 *
	 * @param {Object} list
	 */
	setLocationList : function(list) {
		this.locationList = list;
	},
	/**
	 *
	 */
	getLocationList : function() {
		return this.locationList;
	},
	/**
	 *
	 * @param {Object} elem
	 */
	locationSelectHandler : function(elem) {
		//TODO need to trigger an event
		var key = elem.currentTarget.getAttribute("key");
		this.trigger("location:selected", this.locations.models[key]);
	},
	/**
	 *
	 */
	demo : function() {
		//TODO must be implemented for later on
		// var $result = $('<a class="button">Click Me</a>').click(function() {
		// var lb = new core.views.UserLocationListLightbox({
		// user_id : 1
		// });
		// lb.show();
		// });
		// return $result;
	}
});
