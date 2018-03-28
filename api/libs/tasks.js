let		env =			require('../config/env');

const	findRemove = 	require('find-remove'),
		pool =			require('../models').poolPromise,
		dbUser =		require('../models/user'),
		Events =		require('./events'),
		bitcoinLib =	require('./currencies/bitcoin');

const checkOrders = async () => {
	var query = `SELECT user_id FROM orders WHERE payed=0 AND date > (NOW() - INTERVAL ${ env.ORDER_VALIDITY } MINUTE) GROUP BY user_id`;
	var [users] = await pool.query(query);
	var ftCheckOrders = [];
	for (var i = 0; i < users.length; i++) {
		ftCheckOrders[i] = dbUser.checkAndPayPendingOrders(users[i].user_id, env.devMode ? 't_btc' : 'btc')
	}
	var payedPerUser = await Promise.all(ftCheckOrders);
}

module.exports = {

	/**
	 * Start up tasks
	 */

	start: async function() {
		if (env.bitcoinTasksOn) {
			// await bitcoinLib.services.hardCacheMonitoredAddresses();
			// await bitcoinLib.services.hardUpdateMonitoredAddresses();
			// await bitcoinLib.states.hardUpdateUnconfirmedTransactions(); // TODO If restart and user waiting ...
			// await bitcoinLib.states.hardUpdateConfirmedTransactions();

			// await bitcoinLib.utils.createTransaction("n1UFjwYKikZ1ABab9jKnYjy9ETXUYodqQM", "mtKirnwxrdaXfJKqMhVFpE2hyvvz8ihZ4A", 5);
			// if (err.message == "Address not found in wallet") { // TODO Test error triggered in tests
			// 	console.log("add address");
			// } else if (err.message == "Wallet is currently rescanning. Abort existing rescan or wait.") {
			// 	console.log("Wallet is scanning"); // TODO Do per address
			// 	setTimeout(async () => {
			// 		await test();
			// 	}, 1000 * 1);
			await checkOrders();
		}
		console.log("Starting tasks done");
		this.recurring();
	},

	/**
	 * Recurring tasks
	 */

	recurring: function() {
		ftFindRemove();
		setInterval(ftFindRemove, 1000 * 60 * 1);

		function ftFindRemove() {
			findRemove('uploads', {
				age: {
					seconds: env.TEMP_FILES_MAX_AGE
				},
				extensions: ['']
			})
		}
	}
}
