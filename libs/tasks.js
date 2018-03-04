let env = require('../config/env');

const findRemove = require('find-remove'),
	pool = require('../store').pool,
	dbUser = require('../store/user'),
	Events = require('./events'),
	bitcoinLib = require('./currencies/bitcoin');

const checkOrders = function() {
	return new Promise(function(resolve, reject) {
		var query = `SELECT user_id FROM orders WHERE payed=0 AND date > (NOW() - INTERVAL ${ env.ORDER_VALIDITY } MINUTE) GROUP BY user_id`;

		pool.query(query, async (err, users) => {
			if (err) return reject(err);

			var ftCheckOrders = [];
			for (var i = 0; i < users.length; i++) {
				ftCheckOrders[i] = dbUser.checkAndPayPendingOrders(users[i].user_id, env.devMode ? 't_btc' : 'btc')
			}

			try {
				var payedPerUser = await Promise.all(ftCheckOrders);
				// TODO Implement we restart server and user waits for payments
				// for (var i = 0; i < payedPerUser.length; i++) {
				// 	Events.emit(`user-${ payedPerUser[i].userId }:order-confirmation`, payedPerUser[i].ordersDone);
				// }
				return resolve();
			} catch (err) {
				return reject(err);
			}
		})
	});
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
