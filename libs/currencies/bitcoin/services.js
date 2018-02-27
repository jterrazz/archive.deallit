const	prefixMonitored = "//monitoring-bitcoin-address:",
		bitcoinClient = require('./client'),
		redisClient = require('../../redis');

module.exports = {
	listenToAddress: function(address) {
		return new Promise(function(resolve, reject) {
			try {
				redisClient.get(prefixMonitored + address, async (err, data) => {
					if (err) throw err;

					if (data)
						return resolve();
					await bitcoinClient.importAddress(address);
					redisClient.set(prefixMonitored + address, true, (err, ret) => {
						if (err) throw err;

						return resolve();
					});
				})

			} catch (err) {
				reject(err);
			}
		});
	},

	hardUpdateMonitoredAddresses: async function() {
		try {
			var currentlyMonitored = await bitcoinClient.getAddressesByAccount("");
			for (var i = 0; i < currentlyMonitored.length; i++) {
				currentlyMonitored[i] = prefixMonitored + currentlyMonitored[i];
			}

			redisClient.keys(`${ prefixMonitored }*`, (err, dbMonitored) => {
				if (err) throw err;

				var diff = currentlyMonitored.diff(dbMonitored);
				var multi = redisClient.multi();
				for (var i = 0; i < diff.length; i++) {
					multi.set(diff[i], true);
				}
				multi.exec(function(err, replies) {
					if (err) throw err;
					console.log("REDIS: Added %d new bitcoin monitoring addresses", diff.length);
				})
			})
		} catch (err) {
			console.error("REDIS: Error updating bitcoin monitored addresses", err);
			// TODO Stop server ?
		}
	},
}
