const redis = require('redis');

const connectRedis = () => {
    
    const client = redis.createClient(6379);

    client.connect().then(() => {
        console.log('Redis connected');
    }).catch((err) => {
        console.log('error:', err);
    });

    return client;
}

module.exports = connectRedis;