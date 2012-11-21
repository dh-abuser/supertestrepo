/**
 * Order Model, represents an user order, related to sections
 * @see http://mockapi.lieferheld.de/doc/reference/users/user_orders_details.html
 */

function sync(method, model, options) {
        var me = this;
        var oldSuccess = options.success;
        var modelSet = false;
        options.success = function(model, res, xhr){
            var delivery_address = model.delivery_address;
            if (delivery_address) {
                var address = delivery_address.address;
                var storedAddress = me.get("delivery_address").get("address");
                if ( storedAddress && !_.isEqual(address, storedAddress.toJSON()) ) {
                    delete model.delivery_address; //don't overwrite the model with outdated server-side address
                    oldSuccess.apply(this, arguments); //hydrate the model so we can save it with its new address
                    modelSet = true;
                    me.save({}, {
                        success: function(){
                            me.trigger('order:changeAddress');
                        }
                    });
                }
            }
            if (!modelSet) {
                oldSuccess.apply(this, arguments);
            }
        }
        core.Model.prototype.sync.apply(this, arguments);
    };

function zzz() {



return {

    extend: 'core.Model',

    fields: {
        'id': { 'dataType': 'string' },
        'uri': { 'dataType': 'string' },
        'number': { 'dataType': 'string' },
        // 'coupon': { 'dataType': '', 'default': '' },
        // 'delivery_address': { 'dataType': '', 'default': '' },
        // 'order_price_details': { 'dataType': '', 'default': '' },
        'delivery_time': { 'dataType': 'datetime' },
        'estimated_minutes': { 'dataType': 'string' },
        // 'payment': { 'dataType': '', 'default': '' },
        // 'validity': { 'dataType': '', 'default': '' },
        // 'user_location': { 'dataType': '', 'default': '' },
        'operation': { 'dataType': 'string', 'default': 'validate' },
        'status': { 'dataType': 'string' }
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'sections',
            relatedModel: 'core.models.Section'
        },
        {
            type: Backbone.HasOne,
            key: 'price_details',
            relatedModel: 'core.models.OrderPriceDetails',
            reverseRelation: {
                key: 'order',
                includeInJSON: false
            }
        },
        {
            type: Backbone.HasOne,
            key: 'general',
            relatedModel: 'core.models.OrderGeneral'
        },
        {
            type: Backbone.HasOne,
            key: 'coupon',
            relatedModel: 'core.models.Coupon'
        },
        {
            type: Backbone.HasOne,
            key: 'payment',
            relatedModel: 'core.models.Payment',
            reverseRelation: {
                key: 'order'
            }
        },
        {
            type: Backbone.HasOne,
            key: 'delivery_address',
            relatedModel: 'core.models.DeliveryAddress'
        }
    ],

    validation: {

        'delivery_time': [
            { check: 'required', msg: 'please_choose_your_delivery_time' }
        ],
        'payment': [
            { check: 'required', msg: 'please_select_your_payment_method' },
            { check: 'notEmpty' }
        ],
        'email': [
            { check: 'required', msg: 'email_required' },
            { check: 'notEmpty' },
            { check: 'email', msg: 'valid_email_required' }
        ]
    },

    backEndValidationErrorMap: {
        'delivery_time': {
            '1': {
                attr: 'delivery_time',
                msg:  'invalid_pre_order_time'
            },
            '2': {
                attr: 'delivery_time',
                msg:  'restaurant_still_closed'
            }
        },
        'delivery_address': {
            '1': {
                attr: ['zipcode','suburb'],
                msg:  'invalid_zipcode'
            },
            '2': {
                attr: 'city',
                msg:  'city_not_specified'
            },
            '3': {
                attr: 'street_name',
                msg:  'street_name_not_specified'
            },
            '4': {
                attr: 'street_number',
                msg:  'street_number_required'
            },
            '5': {
                attr: 'name',
                msg:  'name_required'
            },
            '6': {
                attr: 'lastname',
                msg:  'lastname_required'
            },
            '7': {
                attr: 'phone',
                msg:  'phone_required'
            },
            '8': {
                attr: 'email',
                msg:  'email_required'
            }

        },
        'payment_method': {
            attr: 'payment_method',
            msg:  'payment_method_invalid'
        },
        'generic': {
            '615': function(message) {
                var matched = message.match(/<(.*)>/g);
                switch (matched[0]) {
                    case "<email>":
                        var error = {
                            'attr': 'email',
                            'msg':  'valid_email_required',
                            'supressi18n': true
                        };
                    break;
                }
                return error;
            },
            '616': function(message) {
                var attrs = message.match(/<([^>]*)>/g);
                if (attrs && attrs.length > 0) {
                    attrs = attrs.join(",").replace(/[&<>]/g, '').split(",");
                } else {
                    attrs = '';
                }

                var error = {
                     'attr': attrs,
                     'msg' : message.replace(/[&<>]/g, ''),
                     'supressi18n': true
                 }

                 return error;
            },
            '618': function(message) {
                 var error = {
                     'attr': ['zipcode','suburb'],
                     'msg' : message.replace(/[&<>]/g, ''),
                     'supressi18n': true
                 }
                 return error;
            }
        }
    },

    /**
     * Constructor
     *
     */
    initialize: function() {
        core.models.Order.__super__.initialize.call(this);
        if (!this.has('price_details')) {
            this.set('price_details', new core.models.OrderPriceDetails());
        }
        if (!this.has('payment')) {
            this.set('payment', new core.models.Payment());
        }
    },

    /**
    * Override the sync method to account for https://devheld.jira.com/browse/RGP-2096
    * Here we force whichever active address is saved client-side back to the server, if it differs from the address currently saved with the order
    */

    /**
     * TODO refactor the order_price_details name modificatio in the model parse method.
     */
    set: function(key, value, options) {
        core.models.Order.__super__.set.call(this, key, value, options);
        if (this.has('order_price_details')) {
            core.models.Order.__super__.set.call(this, 'price_details', new core.models.OrderPriceDetails(this.get('order_price_details')), {silent: true});
            this.unset('order_price_details');
        }
        return this;
    },

    /**
     * Returns the resource address so that Backbone is able to sync the instance.
     * @see http://mockapi.lieferheld.de/doc/reference/users/user_orders_details.html
     */
    url: function() {
        var uid = this.get('general').get('user_id');
        if (!uid) {
            throw 'missing-user-id';
        }
        var url = ['/api/users/', uid, '/orders/'];
        if (!this.isNew()) {
            url = url.concat([this.id, '/']);
        }
        return url.join('');
    },

    /**
     * Searches an order using the user id and a restaurant id.
     * When such a restaurant is found, the model is then fetched normally
     * @param {Object} param The options for the loading, if search was successful
     * @see http://mockapi.lieferheld.de/doc/reference/users/user_orders_details.html#general
     */
    search: function(options) {
        var uid = this.get('general').get('user_id'),
            rid = this.get('general').get('restaurant_id');
        if (!uid) {
            throw 'missing-user-id';
        }
        var base = [
            '/api/users/', uid, '/orders/',
            '?fields=general&general:restaurant_id=',
            rid, '&status=created'
        ];
        this.fetch(_.extend({}, options, {
            url: base.join(''),
            success: function(order, response) {
                var data = response.data[0] || {};
                if (data.id) {
                    order.set(data);
                    order.fetch(options);
                } else {
                    order.set(order.previousAttributes());
                    if (options.success) {
                        options.success(order, response);
                    }
                }
            }
        }));
    },

     /**
      * Initiate the Order Checkout process
      * @param {Object} formData Checkout Form Data
      * @param {Boolean} validateOnly If true, the form is just validated and not submitted.
      */
    checkout: function(formData, validateOnly) {
        var self = this,
            payment;

        if (this.get('status') != 'created') {
            this.validationErrors = [{
                'attr': 'name',
                'msg': 'this_order_has_already_been_submitted'
            }];
            this.trigger("error:checkout", this);
            return;
        }

        this.isCheckout = true;
        this.setFormData(formData);
        this.validate();

        if (this.validationErrors && this.validationErrors.length > 0) {
            return false;
        }

        if(!validateOnly){
            this.updateUser(this.user);
            this.handleAddress();
        }
    },

    /**
    * Updates the model reading the given form data from the Checkout page
    * @param {Object} formData The serialized form data (see core.views.Form.getValues)
    */
    setFormData: function(formData){
        this.formData = formData;
        this.setData();
    },

    /**
     * Delivery Address Handler
     *
     */
    handleAddress: function() {
        var deliveryAddress, address, order;
        
        order = this;
        
        deliveryAddress = this.get('delivery_address');
        if (deliveryAddress) {
            address = deliveryAddress.get('address');

            if (!address) {
                throw new Error('order.handleAddress(): Address model not found.');
            }

            if (address && _.values(address.attributes).length > 0) {

                var locations = new core.collections.Locations();

                locations.setUrlParams({
                    searchLocation: address.get("street_name") + " " + address.get("suburb") + " " + address.get("zipcode")
                });

                locations.fetch({
                    success: function(locations) {
                        var addresses = new core.collections.DeliveryAddress(),
                            normalisedAddressParts = locations.models[0].get('address');

                        addresses.setUrlParams({
                            'user_id': order.get('general').get('user_id')
                        });

                        addresses.on('noMatch', function() {
                            deliveryAddressAddress = deliveryAddress.get('address');
                            deliveryAddress.post = true;
                            
                            deliveryAddressAddress.set({
                                suburb: normalisedAddressParts.suburb,
                                city: normalisedAddressParts.city,
                                state: normalisedAddressParts.state
                            },{silent: true});

                            deliveryAddress.save(deliveryAddressAddress, {
                                success: function(model, response) {
                                    if (response.errors && response.errors.length > 0) {
                                        if (!_.isArray(order.validationErrors)) {
                                            order.validationErrors = [];
                                        }
                                        order.parseBackendValidationErrors(response);
                                    } else {
                                        order.set({
                                            'delivery_address': deliveryAddress
                                        });
                                        order.checkoutWithAddress();
                                    }
                                },
                                error: function() {
                                    order.validationErrors = [{
                                        attr: '',
                                        msg: 'something_has_gone_wrong'
                                    }];
                                    order.trigger("error:checkout", order);
                                    throw new Error('order.handleAddress(): Could not save delivery address');
                                }
                            });
                        });

                        addresses.on('match multipleMatches', function(matches) {
                            deliveryAddress = _.isArray(matches) ? matches[0] : matches;
                            order.set({
                                'delivery_address': deliveryAddress
                            }, {
                                silent: true
                            });
                            order.checkoutWithAddress();
                        });

                        addresses.search(address, {
                            error: function() {
                                order.validationErrors = [{
                                    attr: '',
                                    msg: 'something_has_gone_wrong'
                                }];
                                order.trigger("error:checkout", order);
                                throw new Error('order.handleAddress(): Could not fetch addresses');
                            }
                        });
                    },
                    error: function() {
                        order.validationErrors = [{
                            attr: '',
                            msg: 'something_has_gone_wrong'
                        }];
                        order.trigger("error:checkout", order);
                        throw new Error('order.handleAddress(): Could not find location');
                    }
                });
            }
        }
    },

    /**
     * Set Data relevant to order Checkout
     *
     */
    setData: function() {
        this.setPayment();
        this.setDeliveryTime();
        this.setDeliveryAddress();
        this.set({
            'terms': this.formData.terms,
            'email': this.formData.email
        }, { silent: true });
    },

    /**
     * Set User
     * @param {Object} user User Model
     */
    setUser: function(user) {
        this.user = user;
        this.get("general").set({ 'user_id': user.id });
    },

    /**
     * Set Delivery Time
     *
     */
    setDeliveryTime: function() {
        var deliveryTimeISO = (this.formData.delivery_time === 'preorder') ? this.formData.preorder_time : '';
        this.set('delivery_time', deliveryTimeISO, {silent: true});
    },

    /**
     * Set Delivery Address
     *
     */
    setDeliveryAddress: function() {
        var address, deliveryAddress;

        address = new core.models.Address();
        address.set({
            'state': this.formData.state,
            'city': '_',
            'zipcode': this.formData.zipcode,
            'suburb': this.formData.suburb,
            'street_name': this.formData.street_name,
            'street_number': this.formData.street_number,
            'unit_number': this.formData.door,
            'phone': this.formData.phone,
            'name': this.formData.name,
            'lastname': this.formData.lastname,
            'other': this.formData.other,
            'company': this.formData.company,
            'comments': this.formData.comments
        }, {silent: true});

        deliveryAddress = new core.models.DeliveryAddress();
        deliveryAddress.set({
            'user_id': this.get('general').get('user_id'),
            'address': address
        });

        this.set('delivery_address', deliveryAddress, {silent: true});
    },

    /**
     * Set payment type
     * 
     */
    setPayment: function() {
        var payment;
        if (this.formData.centralpayment) {
            payment = {
                'method': {
                    id: this.formData.centralpayment
                }
            };
        }
        this.set({'payment': payment},{silent: true});
    },

    /**
     * Save User / Sync with API
     * @param {core.models.User} user User Model
     */
    updateUser: function(user) {
        var order = this;
        user.save({
            'name': this.formData.name,
            'lastname': this.formData.lastname,
            'phone': this.formData.phone,
            'email': this.formData.email
        }, {
            success: function(model, response) {
                if (response.errors && response.errors.length > 0) {
                    order.parseBackendValidationErrors(response);
                    return;
                }
            },
            silent: true
        });
    },

    /**
     * Complete Checkout with a alidated Delivery Address
     * 
     */
    checkoutWithAddress: function() {
        var order = this;

        this.save({}, {
            success: function(model, response) {
                var errors = [];
                if (response.error) {
                    order.validationErrors = [{
                        'attr': '',
                        'msg': 'something_has_gone_wrong'
                    }];
                    order.trigger("error:checkout", order);
                    
                    return;
                }
                // Check for, parse and display Backend Validation Errors
                errors = model.parseBackendValidationErrors(response);

                // If all is well Finalise the order:
                if (!errors && response.status && response.status === 'created') {
                    order.set('operation', 'final');
                    order.save({}, {
                        success: function(model, response) {
                            errors = model.parseBackendValidationErrors(response);
                            if (!errors) {
                                order.finalizeCheckout(response);
                            }
                        },
                        error: function() {
                            order.validationErrors = [{
                                attr: '',
                                msg: 'something_has_gone_wrong'
                            }];
                            order.trigger("error:checkout", order);
                            throw new Error('order.checkoutWithAddress: problem saving (operation:final) order');
                        }
                    });
                }
            },

            error: function(model, errors) {
                if (errors.length > 0) {
                    order.validationErrors = [{
                        attr: '',
                        msg: 'something_has_gone_wrong'
                    }];
                    order.trigger("error:checkout", order);
                    throw new Error('order.checkoutWithAddress: problem saving (operation:validate) order');
                }
            }
        });
    },

    /**
    * Finalizes the checkout depending on the payment method. At the end of the payment, redirects to the order confirmation page.
    */
    finalizeCheckout: function(order){
        var confirmation_url = core.utils.formatURL('/order_confirmation/') + this.get('id');
        this.trigger('finalized');
        if (this.get('payment').isPaypal()) {
            this.trigger('payWithPaypal', order.payment);
        } else {
            if (order.status && _.indexOf(['success', 'progress', 'paying'], order.status) > -1) {
                window.location.href = confirmation_url;
            }
        }
    },

    parse: function(response, xhr) {

        if (_.has(response, 'operation')) {
            delete response.operation;
        }
        var resp = _.extend({},response);
        if (response.delivery_address) {
            if (response.delivery_address.address && _.isEmpty(response.delivery_address.address)) {
                delete response.delivery_address;
            }
        }
        return response;
    },

    /**
     * Parse Backend Validation Errors
     * @param {Object} response JSON response object.
     */
    parseBackendValidationErrors: function(response) {
        var backendValidationErrors = {}, errors = [];

        if (response.validity) {
            // Handle Order Model Validations
            for (validation in response.validity) {
                if (response.validity[validation] === false) {
                    backendValidationErrors[validation] = response.validity.errors && response.validity.errors[validation] ? response.validity.errors[validation] : validation;
                }
            }

            for (validationError in backendValidationErrors) {
                switch (validationError) {
                     case 'delivery_time':
                     case 'delivery_address':
                        for (key in backendValidationErrors[validationError]) {
                            var err = this.backEndValidationErrorMap[validationError];
                            errors.push(this.backEndValidationErrorMap[validationError][backendValidationErrors[validationError][key]]);
                        }
                    break;
                    case 'payment_method':
                        errors.push(this.backEndValidationErrorMap.payment_method);
                    break;
                }
            }
        }

        if (response.errors) {
            // Handle generic 'ERROR' reponse, (probably a user/address)
            for (error in response.errors) {
                errors.push(this.backEndValidationErrorMap.generic[response.errors[error].error_code](response.errors[error].error_message));
            }
        }

        if (errors.length > 0) {
            this.validationErrors = errors;
            this.trigger('error:checkout', this);
            return errors;
        } else {
            return false;
        }
    },

    /**
     * Overriden save method to allow special handling for new records.
     * @see http://documentcloud.github.com/backbone/#Model-save
     */
    save: function(key, value, options) {
        if (this.isNew()) {
            return this.create.apply(this, arguments);
        } else {
            return core.models.Order.__super__.save.apply(this, arguments);
        }
    },

    /**
     * Issues a manual Backbone sync call to create the resource.
     * As it saves on success, no handlers passed in the options
     * are executed on creation success. They are deferred to the
     * consecutive save() call.
     * @return jqXHR The XHR issued by the sync
     */
    create: function(key, value, options) {
        var me = this;
        var sections = me.get('sections').toJSON();
        return Backbone.sync('create', {
            url: me.url(),
            toJSON: function() {
                return { restaurant_id: me.get('general').get('restaurant_id') };
            }
        }, {
            success: function(response) {
                me.parse(response);
                if (me.has('delivery_address')){
                    delete response.delivery_address; //if creating a new order, and there is an active address, use that and not the empty address returned by the POST
                }
                response.sections = sections;
                me.set(response);
                me.save(key, value, options);
            }
        });
    },

    /**
     * Adds the operation attribute to the JSON object for sending to the backend.
     * @return {Object} JSON representation of the instance
     */
    toJSON: function() {
        var json = { id: this.id, operation: this.get('operation') };
        
        if (this.has('general')) {
            json.general = this.get('general').toJSON();
        }

        if (this.has('delivery_address')) {
            json.delivery_address = this.get('delivery_address').toJSON();
        }
        json = _.extend(
            json,
            {sections: this.get('sections').toJSON()},
            {delivery_time: this.get('delivery_time')},
            {delivery_address: this.get('delivery_address')}
        );

        if (this.has('payment')){
            json.payment = this.get('payment').toJSON();
        }
        if (this.has('coupon')){
            json.coupon = this.get('coupon').toJSON();
        }
        return json;
    },

    /**
     * Populates an order model using the content of the provided cart.
     * @param cart {core.models.Order} The used to generate the order
     * @return this {core.models.Order} this
     */
    fromCart: function(cart) {
        var sections = this.get('sections');
        sections.reset();
        var section = new core.models.Section();
        sections.add(section);
        cart.each(function(cartItem, i) {
            // backend does not support multiple section when submitting an order
            // var section = sectionFactory(cartItem.get('sectionId')),
            var items = section.get('items'),
                item = cartItem.get('item');
            item.set('quantity', cartItem.get('quantity'), {silent: true});
            items.add(item);
        });
        return this;
    },

    /**
     * Generates a cart based on an order.
     * @return {core.collections.Cart} A cart having the order items
     */
    toCart: function(existingCart) {
        var cart = existingCart || new core.collections.Cart();
        cart.order = this;
        this.get('sections').each(function(section) {
            section.get('items').each(function(item) {
                cart.add(item, { quantity: item.get('quantity') });
            });
        });
        return cart;
    },

    changeOwner: function(user, options) {
        this.isCheckout = false;
        this.set({
            operation: this.fields.operation['default']
        }, { silent: true });
        if (!this.ownedBy(user)) {
            this.setUser(user);
            this.unset('id');
            this.save(null, options);
        } else if (options.success) {
            options.success(this);
        }
    },

    ownedBy: function(user) {
        return this.get("general").get('user_id') == user.id;
    },

    /**
    * Resets the order's coupon to empty and udpates the price_details accordingly
    */
    resetCoupon: function(){
        this.set("coupon", {
            code: ""
        });
        var price_details = this.get('price_details');
        price_details.set('coupon_fee', 0);
        this.set('price_details', price_details);
        this.trigger('change:price_details');
    },

    /**
     * Front End Validations
     * Override mixed in validate method to accomodate different levels of validation
     * @param {Array} attributes The list of attributes to validate (defaults to all attributes)
     * @param {Object} options A hash that can hold the scenario information
     * @return {mixed} false if no validation error, an array of validation errors otherwise
     */
    validate: function(attributes, options) {
        var failures = [],
            address,
            deliveryAddress,
            orderFailures;

        deliveryAddress = this.get('delivery_address');
        if (deliveryAddress && deliveryAddress.self) {
            
            address = deliveryAddress.get('address');

            if (this.isCheckout) {
                addressFailures = address.validate();

                if(addressFailures.length > 0) {
                    failures = failures.concat(addressFailures);
                }

                orderFailures = core.models.Order.__super__.validate.call(this, attributes, options);

                if (orderFailures.length > 0) {
                    failures = failures.concat(orderFailures);
                }
                
                this.validationErrors = failures;
                this.trigger('error:checkout', this);
                return failures.length ? failures : false;
            }
        }
       return false;
    },

    /**
    * Sets the order's subtotal
    */
    setSubTotal: function(sum) {
        this.get('price_details').set('subtotal', sum);
    },

    hasFee: function() {
        return this.has('price_details') && this.get('price_details').hasFee();
    },

    setRestaurant: function(restaurant) {
        if (!this.checkRestaurantId(restaurant.get('id'))) {
            throw 'wrong-restaurant-for-order';
        }
        this.restaurant = restaurant;
    },

    checkRestaurantId: function(id) {
        if (!this.has('general')) {
            return false;
        }
        if (!this.get('general').has('restaurant_id')) {
            return false;
        }
        return this.get('general').get('restaurant_id') == id;
    }
}
}
