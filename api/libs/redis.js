let env = require('../config/env');

const redis = require("redis");
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client =	redis.createClient({ host: 'redis' });

client.on("error", function (err) {
	console.log(err);
});

module.exports = client;
