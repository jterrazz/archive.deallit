let env = require('../config/env');

const redis = require("redis");
const bluebird = require('bluebird');

if (env.redisOn) {
	bluebird.promisifyAll(redis.RedisClient.prototype);
	bluebird.promisifyAll(redis.Multi.prototype);

	const client =	redis.createClient();

	client.on("error", function (err) {
		console.log(err);
	});

	module.exports = client;
} else {
	module.exports = null;
}
