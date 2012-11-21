tests.models.User = {
    authorize: {}
};

tests.models.User.records = [
    {
        'addresses': '/users/1/delivery_areas',
        'comments': '/users/1/comments',
        'favorites': '/users/1/restaurants',
        'id': 1,
        'uri': '/users/1',
        'orders': '/users/1/orders',
        'general': {
            'birthdate': '1984-12-09',
            'created_at': '2012-04-04T04:04:04Z',
            'email': 'e@mail.com',
            'lastname': 'Dynamite',
            'name': 'Napoleon',
            'phone': '+49152377877878'
        }
    }
];

tests.models.User.authorize.grant = {
    'token': '123abc',
    'user': tests.models.User.records[0]
};
