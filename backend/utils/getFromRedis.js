const connectRedis = require('../config/redis');

const getFromRedis = async(key) => {
    const client = connectRedis();
    const value = await client.get(""+key+"");
    return value;
}

module.exports = getFromRedis;