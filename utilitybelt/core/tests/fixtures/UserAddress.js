/*
 *  Tests related data should be listed here...
 *     
 */

tests.models.exampleAPIResponse = {
            "user_uri": "http://mockapi.lieferheld.de/users/1/", 
            "user_id": "1", 
            "uri": "http://mockapi.lieferheld.de/users/1/addresses/100/", 
            "id": "100", 
            "uri_search": "http://mockapi.lieferheld.de/restaurants/?city=berlin&lat=45.23234&lon=37.77234",
            "address": {
                    "city_slug": "berlin", 
                    "door": "1", 
                    "etage": "1", 
                    "lastname": "The last name", 
                    "street_name": "Mohrenstrasse", 
                    "phone": "01717171717", 
                    "comments": "please, call the ....", 
                    "city": "Berlin", 
                    "name": "The name", 
                    "street_number": "60", 
                    "country": "DE", 
                    "zipcode": "10117", 
                    "suburb": "Berlin",
                    "state": "Germany",
                    "longitude": 37.77234, 
                    "latitude": 45.232340000000001
                } 
        };

tests.models.exampleModelData = {
        user_id: 1,
        id: 100,
        city_slug: "berlin", 
        door: "1", 
        etage: "1", 
        lastname: "The last name", 
        street_name: "Mohrenstrasse",
        phone: "01717171717", 
        comments: "please, call the ....", 
        city: "Berlin", 
        name: "The name", 
        street_number: "60", 
        country: "DE", 
        zipcode: "10117", 
        suburb: "Berlin",
        state: "Germany",
        longitude: 37.77234, 
        latitude: 45.232340000000001
};

tests.models.exampleModelData2 = {
        user_id: 1,
        id: 101,
        city_slug: "berlin", 
        door: "1", 
        etage: "1", 
        lastname: "The last name", 
        street_name: "Greifswalder Straße",
        phone: "01717171717", 
        comments: "please, don not call the ....", 
        city: "Berlin", 
        name: "The name", 
        street_number: "164", 
        country: "DE", 
        zipcode: "10409", 
        suburb: "Berlin",
        state: "Germany",
        longitude: 37.77231 , 
        latitude: 45.23236
};

tests.pagination.page1 = {
        "total_items": 2,
        "limit": 10,
        "total_pages": 1,
        "page": 1,
        "offset": 0
        };

tests.collections.addresses = [tests.models.exampleModelData, tests.models.exampleModelData2];

tests.models.exampleUpdateRequest = {
        "id": 100,
        "user_id": 1, 
        "city": "Berlin",
        "city_slug": "berlin",
        "comments": "please, call the ....",
        "country": "DE",
        "etage": "1",
        "door": "1",
        "latitude": 45.232340000000001,
        "longitude": 37.77234,
        "lastname": "The last name",
        "name": "The name",
        "phone": "01717171717",
        "street_name": "Mohrenstrasse",
        "street_number": "60",
        //"tags": [], optional for API, not required in UI so far
        "zipcode": "10117",
        "suburb": "Berlin",
        "state": "Germany"
};

tests.models.exampleUpdateRequest2 = {
        "id": 101,
        "city": "Berlin",
        "city_slug": "berlin",
        "comments": "please, don not call the ....",
        "country": "DE",
        "etage": "1",
        "door": "1",
        "latitude": 45.23236,
        "longitude": 37.77231,
        "lastname": "The last name",
        "name": "The name",
        "phone": "01717171717",
        "street_name": "Greifswalder Straße",
        "street_number": "164",
        //"tags": [], optional for API, not required in UI so far
        "zipcode": "10409",
        "suburb": "Berlin",
        "state": "Germany"
};

tests.collections.exampleAPIResponse = {
    "pagination": {
        "total_items": 2, 
        "limit": 10, 
        "total_pages": 1, 
        "page": 1, 
        "offset": 0
    }, 
    "data": [
        {
                "id": 100,
                "city": "Berlin",
                "city_slug": "berlin",
                "comments": "please, call the ....",
                "country": "DE",
                "etage": "",
                "latitude": 45.23234,
                "longitude": 37.77234,
                "street_name": "Mohrenstrasse",
                "street_number": "60",
                "zipcode": "10117",
                "suburb": "Berlin",
                "state": "Germany",
                /*TODO: better fix for API inconsistencies, these are here just to make ver 1 work */
                "lastname": "The last name",
                "name": "The name",
                "phone": "01717171717",
                "door":"1"
    }, 
        {
                "id": 101,
                "city": "Berlin",
                "city_slug": "berlin",
                "comments": "please, don not call the ....",
                "country": "DE",
                "etage": "",
                "latitude": 45.23236,
                "longitude": 37.77231,
                "street_name": "Greifswalder Straße",
                "street_number": "164",
                "zipcode": "10409",
                "suburb": "Berlin",
                "state": "Germany",
                /*TODO: better fix for API inconsistencies, these are here just to make ver 1 work */
                "lastname": "The last name",
                "name": "The name",
                "phone": "01717171717",
                "door":"1"
    }
    ]
};