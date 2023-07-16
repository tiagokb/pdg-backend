const pjs = require('../package.json');

const { name, version } = pjs;

module.exports = {
    development: {
        name,
        version,
        serviceTimeout: 30,
    }
}