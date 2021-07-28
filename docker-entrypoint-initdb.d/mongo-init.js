print('Start creating database ##########################')
db = db.getSiblingDB('api-monolithic');
db.createUser(
    {
        user: 'api_user',
        pwd:  'api1234',
        roles: [{role: 'readWrite', db: 'api-monolithic'}],
    }
);

db = db.getSiblingDB('ms-api-admin');
db.createUser(
    {
        user: 'api_user',
        pwd:  'api1234',
        roles: [{role: 'readWrite', db: 'ms-api-admin'}],
    }
);
print('End creating database ##########################')
