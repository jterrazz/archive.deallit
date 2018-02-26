const	server =		require('http').createServer(),
		io =			require('socket.io')(server),
		env =				require('../config/env'),
		Events =		require('../plugins/events-handler');

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
