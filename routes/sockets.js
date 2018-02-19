const	server =		require('http').createServer(),
		io =			require('socket.io')(server),
		env =				require('../config/env'),
		Events =		require('../plugins/events');

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
	client.on('monitor-payment', function(data) {
		var userId = 5;
		var orderId = data.orderId;

		Events.on(`user-${ userId }:bitcoin-transaction`, function(transaction) {
			client.emit('bitcoin-transaction', transaction);
		});

		client.on('disconnect', function() {

		});
	})
});

server.listen(4242);
