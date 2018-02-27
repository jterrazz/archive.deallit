const	server =		require('http').createServer(),
		io =			require('socket.io')(server),
		env =			require('../config/env'),
		Events =		require('../libs/events');

io.on('connection', function(client) {
	client.on('monitor-payments', function(userId) {
		var handleDeposit = function(transaction) {
			client.emit('deposit', transaction);
		}

		var handleOrderConfirmation = function(orders) {
			client.emit('order-confirmation', orders);
		}

		Events.on(`user-${ userId }:deposit`, handleDeposit);
		Events.on(`user-${ userId }:order-confirmation`, handleOrderConfirmation);

		client.on('disconnect', function() {
			Events.removeListener(`user-${ userId }:deposit`, handleDeposit);
			Events.removeListener(`user-${ userId }:order-confirmation`, handleOrderConfirmation);
		});
	})
});

server.listen(env.SOCKET_PORT);
