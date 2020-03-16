let entities = [
    "build/entities/**/*.js"
];

let migrations = [
    "build/migrations/**/*.js"
];

// Override to run this in dev mode
if (process.env.NODE_ENV === "development") {
    entities = [
        "src/entities/**/*.ts"
    ];

    migrations = [
        "src/migrations/**/*.ts"
    ];
}

// TODO: Fetch the details from env vars
module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "chowkuser",
    "password": "chowk",
    "database": "chowk",
    "synchronize": true,
    "logging": false,
    "entities": entities,
    "migrations": migrations,
};