const	PREFIX_BITCOIN_MONITORED = "//monitoring-bitcoin-address:",
		bitcoinClient = require('./client'),
		pool = require('../../../store').poolPromise,
		env = require('../../../config/env'),
		redisClient = require('../../redis');

module.exports = {
	listenToAddress: function(address) {
		return new Promise(function(resolve, reject) {
			try {
				redisClient.get(PREFIX_BITCOIN_MONITORED + address, async (err, data) => {
					if (err) throw err;

					if (data)
						return resolve();
					await bitcoinClient.importAddress(address);
					redisClient.set(PREFIX_BITCOIN_MONITORED + address, true, (err, ret) => {
						if (err) throw err;

						return resolve();
					});
				})

			} catch (err) {
				reject(err);
			}
		});
	},

	hardCacheMonitoredAddresses: function() { // TODO Also check if some in cache and not in node
		return new Promise(async function(resolve, reject) {
			try {
				var currentlyMonitored = await bitcoinClient.getAddressesByAccount("");
				for (var i = 0; i < currentlyMonitored.length; i++) {
					currentlyMonitored[i] = PREFIX_BITCOIN_MONITORED + currentlyMonitored[i];
				}

				redisClient.keys(`${ PREFIX_BITCOIN_MONITORED }*`, (err, dbMonitored) => {
					if (err) throw err;

					var diff = currentlyMonitored.diff(dbMonitored);
					var multi = redisClient.multi();
					for (var i = 0; i < diff.length; i++) {
						multi.set(diff[i], true);
					}
					multi.exec(function(err, replies) {
						if (err) throw err;

						return resolve(diff.length);
					})
				})
			} catch (err) {
				return reject(err);
			}
		});
	},

	hardUpdateMonitoredAddresses: function() {
		return new Promise(async (resolve, reject) => {
			try {
				var currentlyMonitored = await bitcoinClient.getAddressesByAccount("");
				var listenToAddresses = [];
				var allToMonitor = [];

				var [walletsSql] = await pool.query("SELECT public_address FROM user_wallets WHERE type=?", [env.devMode ? 't_btc' : 'btc']);
				for (var i = 0; i < walletsSql.length; i++) {
					allToMonitor[i] = walletsSql[i].public_address;
				}

				var diff = allToMonitor.diff(currentlyMonitored);
				diff.forEach(toMonitor => {
					listenToAddresses.push(this.listenToAddress(toMonitor)); // TODO Error not catched ?
				})
				Promise.all(listenToAddresses)
					.then(() => {
						return resolve();
					})
					.catch((err) => {
						return reject(err);
					})
			} catch (err) {
				return reject(err);
			}
		});
	},
}
