
/** Basic application page class, contains features which should be on every page */

core.define('docs.Page', {

    extend: 'core.Page',

    initialize: function() {
   
        var me = this, url = me.options.url, tab = me.options.tab;
        me.active_tab = tab;

        $(document).ready(function() {

            me.initLS();

            // var doc_obj = core.Class.instantiate(url);
            me.setDocs(url);

            $.ajax({
                url: 'data/Classes.json?d=' + new Date().getTime(),
                dataType: 'json',
                success: function(data) {
                    me.buildMenu(data, url);
                    // $( "#accordion" ).accordion();
                    // var processed = me.processData(data, url);
                    // var processed_classes = processed.classes;
                    // var current_class = processed.current;
                    // me.setTitle(current_class);
                    // $('body *').jqTransform( { imgPath:'images/jqtransform/' } );
              }
            });

            $(".tabs").tabs({ select: function(event, ui) { /*
                var tab_id = ui.panel.id, route = url + '/' + tab_id;
                core.app_router.navigate(route); */
            } })/*.tabs('select')*/;

            /* Init search */
            // var classes = [ 'core.views.Lightbox', 'core.views.UserAddressListLightbox', 'core.views.UserAddressLightbox' ];
            // $( ".bar_search input" ).autocomplete({
            //     source: classes
            // });
        });


        // this.setTitle('title <span class="normalcase">(' + doc_obj.self + ')</span>');
        // this.setDocs('data/' + url + '.json', url);

        // me.setDocs('data/Lightbox.json', 'core.views.Lightbox');

        // $('#open-widget').unbind().click( function() {
        //     var lb = new core.views.Lightbox({ title: 'Some awesome title', content: 'Awesomest content' });
        //     lb.show();
        // });
    },

    processData: function(data, url) {
        for (var i=0,ii=data.length; i<ii; i++) {
            for (var j=0,jj=data[i].items.length; j<jj; j++) {
                // var doc_obj = core.Class.instantiate(data[i].items[j].className);
                console.log(data[i].items[j].className);
            }
        }
    },

    buildMenu: function(data, url) {
        var me = this,
            accordion = $('#accordion').empty();
        for (var i=0,ii=data.length; i<ii; i++) {
            var ct = $('<h4><a href="javascript:">' + data[i].category + '</a></h4><div class="widgets-menu"><ul class="unstyled"></ul></div>').appendTo(accordion).find('ul');
            if (data[i].items) {
                var its = data[i].items;
                for (var j=0,jj=its.length; j<jj; j++) {
                    var css_class = '';
                    if (its[j].className == url) {
                        this.setTitle(its[j].title + ' <span class="normalcase">(' + its[j].className + ')</span>');
                        css_class = 'active';
                    }
                    var $ln = $('<li><a data-className="' + its[j].className + '" class="' + css_class + '">' + ( its[j].title || its[j].className ) +'</a></li>');
                    $ln.attr('className', its[j].className);
                    $ln.appendTo(ct).click(function() {
                        var className = $(this).attr('className');
                        core.app_router.navigate(className/* + '/' + me.active_tab*/, { trigger: true });
                    });
                }
            }
        }
    },

    initLS: function() {

        /* Prepopulate LS with some mock-up data */

        if (localStorage.getItem('ub-docs-data11') !== 'true') {
            localStorage.clear();
            var data = [
                { id: 1, "user_id": 1, "email": "my@email.com", "city_slug": "berlin", "city": "Berlin", "door": "", "etage": "", "street_number": "60", "lastname": "The last name", "street_name": "Mohrenstrasse", "zipcode": "10117", "comments": "please, call the ....", "phone": "01717171717", "longitude": 37.77234, "country": "DE", "latitude": 45.232340000000001, "name": "The name"},
                { id: 2, user_id: 1, email: 'some@dot.com' ,city_slug: "berlin", door: "", etage: "", lastname: "The last name", street_name: "Greifswalder Straße", phone: "01717171717", comments: "please, don not call the ....", city: "Berlin", name: "The name", street_number: "164", country: "DE", zipcode: "10409", longitude: 37.77231 , latitude: 45.23236 }
            ];
            for (var i=0,ii=data.length; i<ii; i++) {
                var rec = new core.models.Address(data[i]);
                rec.save();
            }
            localStorage.setItem('ub-docs-data12', true);
        }

    },

    setTitle: function(title) {
        $('.class-name').html(title);
    },

    setDemo: function() {
    },

    setDocs: function(class_name, class_title) {
        var docClass = core.Class.instantiate(class_name);
        var self = docClass.self, extend = docClass.extend;
        var url = 'data/' + self + '.json?nocache=' + new Date().getTime();

        $('#demo').empty();
        if (docClass.demo) {
            var result = docClass.demo();
            if (result.self) {
                result.renderTo($('#demo'));
            }
            else {
                $('#demo').append(result);
            }
        }

        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data){
                var klass = { description: data[0].description.summary };
                var methods = [];
                for (var i=1,ii=data.length; i<ii; i++) {
                    if (data[i].code.match(/(^[a-zA-Z_0-9]+):/gi))
                        var method = RegExp.$1;
                    else
                        continue;

                    var returns = '', params = [];
                    for (var j=0,jj=data[i].tags.length; j<jj; j++) {

                        // if (data[i].tags[j].type == 'method')
                        //     method = data[i].tags[j].string;

                        if (data[i].tags[j].type == 'param') {
                            params.push(data[i].tags[j]);
                        }
                        if (data[i].tags[j].type == 'returns') {
                            returns = data[i].tags[j].string;
                        }
                    }

                    var vars = { method: method, description: data[i].description.summary, params: params, returns: returns };
                    if (!method) {
                        methods.push(vars);
                    }
                }

                var tpl = '<p>{{ klass.description }}</p>' +
                        '<p>Extend: {{ extend }}</p>' +
                        '<h2>API</h2>' +
                        '{% _.each(methods, function(method) { %}' +
                            '<p><b style="font-size:14px;">{{ method.method.trim() }}(' +
                            '{% _.each(method.params, function(param) { %}' +
                            '<i>{{ param.types[0] }} {{ param.name }}</i>' +
                            '{% }); %}' +
                            ') {% if (method.returns) { %}: <i>{{ method.returns }}</i>{% } %}</b></p>' +
                            '<p>{{ method.description }}</p>' +
                        '{% }); %}';
                if (!methods.length) {
                    tpl += '<p>See {{ extend }}</p>';
                }

                $('#documentation').html(_.template(tpl)({ methods: methods, klass: klass, extend: extend }));
            }
        });
    }
});
