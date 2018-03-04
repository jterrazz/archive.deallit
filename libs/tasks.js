let env = require('../config/env');

const findRemove = require('find-remove'),
	pool = require('../store').poolPromise,
	dbUser = require('../store/user'),
	Events = require('./events'),
	bitcoinLib = require('./currencies/bitcoin');

const checkOrders = async () => {
	var query = `SELECT user_id FROM orders WHERE payed=0 AND date > (NOW() - INTERVAL ${ env.ORDER_VALIDITY } MINUTE) GROUP BY user_id`;
	var [users] = await pool.query(query);
	var ftCheckOrders = [];
	for (var i = 0; i < users.length; i++) {
		ftCheckOrders[i] = dbUser.checkAndPayPendingOrders(users[i].user_id, env.devMode ? 't_btc' : 'btc')
	}
	var payedPerUser = await Promise.all(ftCheckOrders);

	// TODO Implement we restart server and user waits for payments
	// for (var i = 0; i < payedPerUser.length; i++) {
	// 	Events.emit(`user-${ payedPerUser[i].userId }:order-confirmation`, payedPerUser[i].ordersDone);
	// }
}

// When block found, check to confirm pending txs and also remove from redis the unconfirmed
module.exports = {

	/**
	 * Start up tasks
	 */

	start: async function() {
		await bitcoinLib.services.hardCacheMonitoredAddresses();
		await bitcoinLib.services.hardUpdateMonitoredAddresses();
		await bitcoinLib.states.hardUpdateUnconfirmedTransactions(); // TODO If restart and user waiting ...
		await bitcoinLib.states.hardUpdateConfirmedTransactions();
		await checkOrders();
		return Promise.resolve();
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
