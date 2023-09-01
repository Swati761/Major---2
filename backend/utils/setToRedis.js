const connectRedis = require('../config/redis');

const setToRedis = async(key, value) => {
    const client = connectRedis();
    client.set(key, value);
}

module.exports = setToRedis;