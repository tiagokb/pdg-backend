require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres'
    },
    test: {
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST_TEST,
        dialect: 'postgres'
    }
}