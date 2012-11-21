/**
* jQueryUI autocomplete implementation for Locations 
*/
core.define('core.mixins.AutosuggestLocations', {

    /** 
    * Re-enable autosuggest after it was disabled 
    */
    enableAutosuggest: function() {
        this.getSearchInputField().autocomplete('enable');
    },

    /**
     * Run when user types something into autosuggestion field (see http://jqueryui.com/demos/autocomplete/#option-source)
     */
    suggestLocation: function( request, response ) {

        var term =  this.cleanSearchTerm(request.term), me = this;

        if (!me.cache) 
            me.cache = {};

        if (term in me.cache) {
            response(me.cache[term]);
        }
        else {
            var locations = new core.collections.Locations();
            locations.setUrlParams({ searchLocation: request.term, limit: 0 }); 
            locations.fetch( { silent: true, success: _.bind(this.onFoundSuggestions, this, term, response), error: _.bind(this.onEmptySuggestion, this) });           
        }

    },

    /**
     * Callback for successful autosuggest request 
     * @param {String} term Search term
     * @param {Function} response jQueryUI autocomplete callback 
     * @param {core.collections.Locations} locations Locations collection
     * @param {Object} rawData from ajax response
     */
    onFoundSuggestions: function( term, response, locations, rawData ) {
        if (!locations || locations.length == 0) {                
            this.onEmptySuggestion();
            return;
        }
        else {
            locations = locations.filterByRelevance(term).sortByRelevance(term);
            var list = locations.viewJSON();
            this.cache[term] = list;
            response(list);
        }
    },

    /**
     * Callback for empty autosuggest request
     */
    onEmptySuggestion: function() {
        this.searchInputField.autocomplete('close');
    },

    /**
     * Run when user select something from the autosuggest list (see http://jqueryui.com/demos/autocomplete/#event-select)
     */
    onSelectSuggestedLocation: function(event, ui) {
        this.trigger("locationFound", {
            'name': 'locationFound',
            'collection': new core.collections.Locations([{ 'address': ui.item } ]) 
        });
    },

    /**
     * starting the search when the formular is send via button click or pressing enter in the input field
     * @param {Object} event Object for using it in prevent Default
     */
    suggestOnEnter: function(event) {
      
        if (this.__disabled) {
            event.preventDefault();
            return;
        }
        var searchLocationValue = this.cleanSearchTerm(this.getSearchInputField().val());
        var me = this;

        core.utils.trackingLogger.log("search", "search_event_searchbox_address_submit", searchLocationValue);

        //nothing typed in the search input field
        if (searchLocationValue.length == 0) {
            this.onEmptyLocation();
            event.preventDefault();
            return;
        }

        //check if there is an entry in the input field
        //if not then let it 3x glow => jquery
        var locationsCollection = new core.collections.Locations();

        me.getSearchInputField().autocomplete('close');
        me.getSearchInputField().autocomplete('disable');

        locationsCollection.setUrlParams({
            searchLocation: searchLocationValue,
            limit: 0
        });

        var throbber = new core.views.Throbber({ auto: false });
        throbber.show();

        locationsCollection.fetch({
            success: function(collection, response) {
                throbber.hide();
                collection = collection.filterByRelevance(searchLocationValue).sortByRelevance(searchLocationValue);
                if (response.data.length > 0) {
                    me.trigger("locationFound", {
                        name: 'locationFound',
                        response: response,
                        collection: collection,
                        searchTerm: searchLocationValue
                    });
                } else {
                    core.utils.trackingLogger.logError('search_error_nomatch_address', searchLocationValue);
                    me.trigger("locationNotFound", {
                        'name': 'locationNotFound',
                        'searchValue': searchLocationValue
                    });
                }
            },
            error: function(collection, xhr, options) {
                throbber.hide();
                if (_.indexOf([500, 502], xhr.status) === -1) {
                    me.trigger("locationFetchError", {
                        'name': 'locationFetchError'
                    });
                }
            }
        });
        event.preventDefault();
    },

    /**
     * Clean-up search term before sending
     * @param {String} term Search term
     * @return {String} 
     */
    cleanSearchTerm: function(term) {
        return _.str.trim(_.str.clean(term));
    }

})