let env = require('../config/env');

const findRemove = require('find-remove'),
	pool = require('../store'),
	dbUser = require('../store/user'),
	bitcoinLib = require('./currencies/bitcoin');

const checkOrders = function() {
	return new Promise(function(resolve, reject) {
		pool.query(`SELECT user_id FROM orders WHERE payed=0 AND date > (NOW() - INTERVAL ${ env.ORDER_VALIDITY } MINUTE) GROUP BY user_id`, (err, users) => {
			if (err) return reject(err);

			var ftCheckOrders = [];
			for (var i = 0; i < users.length; i++) {
				ftCheckOrders[i] = dbUser.checkAndPayPendingOrders(users[i].user_id, env.devMode ? 't_btc' : 'btc') // TODO Triggers errors
			}
			Promise.resolve(ftCheckOrders).then(function(results) {
				console.log(results);
				results.forEach(function(err, i, arr) {
					if (err instanceof Error && err.code !== 'ER_DUP_ENTRY')
						return reject(err);
					arr[i] = null;
				});
				return resolve(results);
			});
		})
	});
}

module.exports = {

	/**
	 * Start up tasks
	 */

	start: function() {
		return new Promise(async function(resolve, reject) {
			try {
				await bitcoinLib.services.hardCacheMonitoredAddresses();
				await bitcoinLib.services.hardUpdateMonitoredAddresses();
				var newDeposits = await bitcoinLib.states.hardUpdateTotalReceived();
				await checkOrders();
				return resolve();
			} catch(err) {
				return reject();
			}

			// var orders = await dbUser.checkAndPayPendingOrders(userId, transaction.currency);
			// Events.emit(`user-${ userId }:order-confirmation`, orders);
			//
			// var pendingOrders = [];
			// HARD CHECK WALLETS ? START + EVERY ?
		});
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
