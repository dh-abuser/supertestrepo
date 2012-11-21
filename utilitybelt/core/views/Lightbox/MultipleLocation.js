/**
 * Lightbox with the User Location List inside
 *
 * Examples:
 *
 *     var lb = new core.views.MultipleLocationLightbox();
 *     lb.show();
 *
 * @extends core.views.Lightbox
 */

core.define('core.views.MultipleLocationLightbox', {

	extend : 'core.views.Lightbox',

	template : ["MultipleLocation/MultipleLocation.html"],

	events : {
		"click .top-box .close-icon" : "hide",
		"click .closeLB.button" : "hide"
	},
	
	options: {
	    closeButton: true,
	    blanketId: 'dark_blanket'
	},

	__shown : false,

	className : 'MultipleLocationLightbox',

	/**
	 * Constructor
	 * @constructor
	 * @param {Object} options Options
	 */
	initialize : function(options) {
		this.locations = this.options.locations;
		var me = this;
		this.title = jsGetText("multiple_location_found");

		this.searchTerm = this.options.searchTerm;
		this.on('render', function() {
			//adding the map and the list
			me.map = me.addItem(core.views.Map, {
				locations : me.locations
			}, ".maps");
			me.map.on("markerClick", me.locationSelectHandler, me);
			
			var listOptions = {
				locations : me.locations,
				getBackgroundCSS : me.getBackgroundCSS
			};
			me.map.render();
			me.list = me.addItem(core.views.MultipleLocationList, me.options, ".streets");
			me.list.on("location:selected", me.locationSelectHandler, me);
			me.list.render();

			core.utils.trackingLogger.log('search', 'search_event_popup_suggestions_display', this.searchTerm, me.locations.length);
		});
		core.views.MultipleLocationLightbox.__super__.initialize.call(this);
	},
	addItem : function(type, config, place) {
		if (place != null) {
			var positionElement = $('.body-box', this.$el).find(place);
			var new_el = new type(config);
			$(positionElement).html(new_el.$el);
			return new_el;
		} else if (this.getBody) {
			core.views.MultipleLocationLightbox.__super__.addItem.call(this, type, config);
		}
	},
	/**
	 * setLocationList
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
	 * locationSelectHandler
	 * @param {Object} elem
	 */
	locationSelectHandler : function(elem) {
		core.utils.trackingLogger.log('search', 'search_event_popup_suggestions_select', this.searchTerm, this.locations.length);
		this.trigger("location:selected", elem);
	},
	hide : function() {
		//TODO as soon as we have a container object which keeps children we can add them here
		if (this.map) {
			this.map.hide();
		}
		if (this.list) {
			this.list.remove();
		}
		this.__shown = false;
		core.views.MultipleLocationLightbox.__super__.hide.call(this);
	},
	show : function() {
		this.__shown = true;
		core.views.MultipleLocationLightbox.__super__.show.call(this);
	},
	isShown : function() {
		return this.__shown;
	},
	demo : function() {

		var locations = {
			"pagination" : {
				"total_items" : 2,
				"limit" : 10,
				"total_pages" : 1,
				"page" : 1,
				"offset" : 0
			},
			"data" : [{
				"uri_search" : "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=45.23234&long=37.77234",
				"address" : {
					"city_slug" : "berlin",
					"city" : "Berlin",
					"street_number" : "60",
					"latitude" : 45.232340000000001,
					"country" : "DE",
					"street_name" : "Mohrenstrasse",
					"zipcode" : "10117",
					"longitude" : 37.77234
				}
			}, {
				"uri_search" : "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=46.2004&long=37.88774",
				"address" : {
					"city_slug" : "berlin",
					"city" : "Berlin",
					"street_number" : "59",
					"latitude" : 46.40000000000002,
					"country" : "DE",
					"street_name" : "Mohrenstrasse",
					"zipcode" : "10117",
					"longitude" : 37.887740000000001
				}
			}, {
				"uri_search" : "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=46.2004&long=37.88774",
				"address" : {
					"city_slug" : "berlin",
					"city" : "Berlin",
					"street_number" : "59",
					"latitude" : 46.200400000000002,
					"country" : "DE",
					"street_name" : "Mohrenstrasse",
					"zipcode" : "10117",
					"longitude" : 37.987740000000001
				}
			}, {
				"uri_search" : "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=46.2004&long=37.88774",
				"address" : {
					"city_slug" : "berlin",
					"city" : "Berlin",
					"street_number" : "59",
					"latitude" : 46.400400000000002,
					"country" : "DE",
					"street_name" : "Mohrenstrasse",
					"zipcode" : "10117",
					"longitude" : 37.987740000000001
				}
			}]
		};

		var $result = $('<a class="button">Click Me</a>').click(function() {
			var lb = new core.views.MultipleLocationLightbox({
				locations : locations.data
			});
			lb.show();
		});
		return $result;
	}
});
