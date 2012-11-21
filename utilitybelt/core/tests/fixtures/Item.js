tests.models.Item = {
    records: {}
};
tests.collections.Item = {
    records: {}
};

tests.collections.Item.records.main = [
    {
        "description": "inkl. 0,15\u20ac Pfand",
        "sizes": [{
            "price": 5,
            "name": "L"
        }],
        "pic": "",
        "main_item": true,
        "sub_item": false,
        "id": "mp1",
        "name": "Fanta*1,3,5,7 0,5L  "
    }, {
        "description": "inkl. 0,15\u20ac Pfand",
        "sizes": [{
            "price": 20,
            "name": "XL"
        }],
        "pic": "",
        "main_item": true,
        "sub_item": false,
        "id": "mp2",
        "name": "Sprite*1,2,3,5,7 0,5L"
    }
];

tests.collections.Item.records.sub = [
    {
        "description": "",
        "sizes": [{
            "price": 0.10,
            "name": "sosmall"
        }],
        "pic": "",
        "main_item": false,
        "sub_item": true,
        "id": "sp1",
        "name": "Bombastic "
    }, {
        "description": "",
        "sizes": [{
            "price": 0.20,
            "name": "sohuge"
        }],
        "pic": "",
        "main_item": false,
        "sub_item": true,
        "id": "sp2",
        "name": "Deluxe "
    }
];

tests.models.Item.records.flavors = [{
    "items": tests.collections.Item.records.sub,
    "id": "f1",
    "structure": "1"
}];

tests.models.ItemWithNestedFlavors = {
    "flavors": {
        "items": [{
            "flavors": {
                "items": [{
                    "description": "",
                    "sizes": [{
                        "price": 0.60,
                        "name": "normal"
                    }],
                    "pic": "",
                    "main_item": false,
                    "sub_item": true,
                    "id": "1131061",
                    "name": "Balsamico"
                }, {
                    "description": "",
                    "sizes": [{
                        "price": 0.60,
                        "name": "normal"
                    }],
                    "pic": "",
                    "main_item": false,
                    "sub_item": true,
                    "id": "1131062",
                    "name": "Caesar*1"
                }],
                "id": "76666",
                "structure": "0"
            },
            "description": "",
            "sizes": [],
            "pic": "",
            "main_item": false,
            "sub_item": false,
            "id": "76666",
            "name": "Extra Dressing"
        }, {
            "flavors": {
                "items": [{
                    "description": "",
                    "sizes": [{
                        "price": 0.00,
                        "name": "normal"
                    }],
                    "pic": "",
                    "main_item": false,
                    "sub_item": true,
                    "id": "1131059",
                    "name": "Balsamico"
                }, {
                    "description": "",
                    "sizes": [{
                        "price": 0.00,
                        "name": "normal"
                    }],
                    "pic": "",
                    "main_item": false,
                    "sub_item": true,
                    "id": "1131060",
                    "name": "Caesar*1 "
                }, {
                    "description": "",
                    "sizes": [{
                        "price": 0.00,
                        "name": "normal"
                    }],
                    "pic": "",
                    "main_item": false,
                    "sub_item": true,
                    "id": "1131057",
                    "name": "ohne Dressing"
                }],
                "id": "76665",
                "structure": "1"
            },
            "description": "",
            "sizes": [],
            "pic": "",
            "main_item": false,
            "sub_item": false,
            "id": "76665",
            "name": "Dressing"
        }],
        "id": "1633809",
        "structure": "-1"
    },
    "description": "und Parmesan (inkl. 1 Dressing) ",
    "sizes": [{
        "price": 4.50,
        "name": "normal"
    }],
    "pic": "",
    "main_item": true,
    "sub_item": false,
    "id": "1633809",
    "name": "Gemischter Salat mit H\u00e4hnchenbrustfilet "
}