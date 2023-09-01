const mongoose = require('mongoose');
const redis = require('redis');

const connectDB = () => {
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug', true);
    }

    mongoose.connect(process.env.MongoDB, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log("error:", err);
    });
    
    const client = redis.createClient(6379);

    client.connect().then(() => {
        console.log('Redis connected');
    }).catch((err) => {
        console.log('error:', err);
    });
}

module.exports = connectDB;
