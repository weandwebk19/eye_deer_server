require('dotenv').config();
const redis = require("ioredis");

const rediscl = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD
});

module.exports = rediscl;