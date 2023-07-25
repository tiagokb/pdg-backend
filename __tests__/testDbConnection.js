const db = require('../models');

async function testConnection(){

    try {
        await db.sequelize.authenticate();
        console.log("connection has been established succesfully");
    } catch (error) {
        console.log("error message:", error.message);
    }
}

testConnection();