const	bitcoinClient = require('./client'),
		bitcoinServices = require('./services');

const prefixMonitored = "//monitoring-bitcoin-address:"; // TODO GENERAL var

module.exports = {
	getBalanceByAddress: function(address) {
		return new Promise(async function(resolve, reject) {
			try {
				await bitcoinServices.listenToAddress(address);

				var balance = 0;
				var unspent = await bitcoinClient.listUnspent(0, 999999999, [address]);

				unspent.forEach(transaction => {
					if (transaction.confirmations)
						balance += transaction.amount;
				})
				return resolve(balance);
			} catch (err) {
				return reject(err);
			}
		});
	},

	getReceivedByAddress: function(address) {
		return new Promise(async function(resolve, reject) {
			try {
				await bitcoinServices.listenToAddress(address);

				var received = await bitcoinClient.getReceivedByAddress(address);
				return resolve(received);
			} catch (err) {
				return reject(err);
			}
		});
	},
}
