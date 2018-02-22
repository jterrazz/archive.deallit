const	redis =		require("redis"),
		client =	redis.createClient();

client.on("error", function (err) {
	console.log(err);
});

//TODO Stop critical operations on error
module.exports = client;
