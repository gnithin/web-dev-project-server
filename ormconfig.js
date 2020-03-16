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

// Fetch the details from env vars
module.exports = {
    "type": process.env.DB_TYPE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_SCHEMA,
    "synchronize": true,
    "logging": false,
    "entities": entities,
    "migrations": migrations,
};