// import Redis from 'ioredis';
const Redis = require('ioredis');
const { promisify } = require('util');
const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    keyPrefix: "cache",
});

function getRedis(value) {
    const syncRedisGet = promisify(redisClient.get).bind(redisClient);
    return value ? syncRedisGet(value) : null;
}

function setRedis(key, value, timeExp) {
    const syncRedisSet = promisify(redisClient.set).bind(redisClient);
    return value ? syncRedisSet(key, value, "EX",timeExp) : null;
}

function delRedis(key) {
    const syncRedisDel = promisify(redisClient.del).bind(redisClient);
    return key ? syncRedisDel(key): null
}

function delPrefix(prefix) {
    const syncRedisDel = promisify(redisClient.del).bind(redisClient);
    const syncRedisKeys = promisify(redisClient.keys).bind(redisClient);
    const keys = (syncRedisKeys(`cache:${prefix}:*`)).map((key)=>{
        key.replace("cache", "");
    });
    return syncRedisDel(keys);
}

module.exports = { redisClient, getRedis, setRedis, delRedis, delPrefix };
