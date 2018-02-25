const	server =		require('http').createServer(),
		io =			require('socket.io')(server),
		env =				require('../config/env'),
		Events =		require('../plugins/events-handler');

const blocktrail =	require('blocktrail-sdk'),
blocktrailClient =		blocktrail.BlocktrailSDK({
	apiKey: "77f704597ec021c7beabeead9da4e2f5ea098928",
	apiSecret: "aa51f641f1f1e589f9b58877f535ca553160e031e",
	network: env.devMode ? "tBTC" : "BTC",
});

// blocktrailClient.subscribeAddressTransactions('webhook-0', 'mvnWB9S6xBWssbD468DP39Tak3B17txbSN', 2, function(err, result) {
// 	if (err)
// 		console.log(err);
//
// 	// Save in redis exists
// });

io.on('connection', function(client) {
	client.on('monitor-payments', function(userId) {
		Events.on(`user-${ userId }:deposit`, function(transaction) {
			client.emit('deposit', transaction);
		});

		Events.on(`user-${ userId }:order-confirmation`, function(orders) {
			client.emit('order-confirmation', orders);
		})

		client.on('disconnect', function() {
			// TODO Remove from Events
		});
	})
});

server.listen(4242);
