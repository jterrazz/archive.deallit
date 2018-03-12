const	bitcoinClient = require('./client'),
		pool = require('../../../models').poolPromise,
		env = require('../../../config/env'),
		redisClient = require('../../redis');

module.exports = {
	listenToAddress: async function(address) {
		var data = await redisClient.getAsync(env.PREFIX_BITCOIN_MONITORED + address);

		if (data)
			return;
		await bitcoinClient.importAddress(address);
		await redisClient.setAsync(env.PREFIX_BITCOIN_MONITORED + address, true);
	},

	hardCacheMonitoredAddresses: async function() { // TODO Also check if some in cache and not in node
		var currentlyMonitored = await bitcoinClient.getAddressesByAccount("");
		for (var i = 0; i < currentlyMonitored.length; i++) {
			currentlyMonitored[i] = env.PREFIX_BITCOIN_MONITORED + currentlyMonitored[i];
		}
		var dbMonitored = await redisClient.keysAsync(`${ env.PREFIX_BITCOIN_MONITORED }*`);
		var diff = currentlyMonitored.diff(dbMonitored);

		// Send to redis
		var multi = redisClient.multi();
		for (var i = 0; i < diff.length; i++) {
			multi.set(diff[i], true);
		}
		await multi.execAsync();
		return diff.length;
	},

	hardUpdateMonitoredAddresses: async function() {
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
		await Promise.all(listenToAddresses);
		return Promise.resolve();
	},
}
