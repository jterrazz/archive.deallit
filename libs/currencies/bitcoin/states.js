const bitcoinClient = require('./client'),
	pool = require('../../../store'),
	env = require('../../../config/env'),
	dbUser = require('../../../store/user'),
	bitcoinServices = require('./services');

const prefixMonitored = "//monitoring-bitcoin-address:"; // TODO GENERAL var
const BITCOIN_CONFIRMATIONS = 2;
const BITCOIN_MAX_CONFIRMATIONS = 999999999;
const SATOSHI_UNITS = 100000000;

module.exports = {
	hardUpdateTotalReceived: function() {
		return new Promise((resolve, reject) => {
			pool.query("SELECT public_address, total_received, user_id FROM user_wallets WHERE type=?", [env.devMode ? 't_btc' : 'btc'], async (err, dbWallets) => {
				try {
					if (err) return reject(err);

					var ftGetReceived = [];
					for (var i = 0; i < dbWallets.length; i++) {
						ftGetReceived[i] = this.getReceivedByAddress(dbWallets[i].public_address, BITCOIN_CONFIRMATIONS);
					}
					var realWallets = await Promise.all(ftGetReceived);
					var ftUpdateDeposits = [];
					for (var i = 0; i < dbWallets.length; i++) {
						// TODO Optimisation ?
						if (dbWallets[i].total_received !== realWallets[i]) {
							var unspent = await bitcoinClient.listUnspent(BITCOIN_CONFIRMATIONS, BITCOIN_MAX_CONFIRMATIONS, [dbWallets[i].public_address]);
							unspent.forEach(transaction => {
								ftUpdateDeposits.push(dbUser.saveDeposit({
									valueDeposit: transaction.amount * SATOSHI_UNITS,
									userId: dbWallets[i].user_id,
									currency: (env.devMode ? 't_btc' : 'btc'),
									hash: transaction.txid
								}, dbWallets[i].public_address))
							})
						}
					}

					Promise.settle(ftUpdateDeposits).then(function(results) {
						results.forEach(function(err, i, arr) {
							if (err instanceof Error && err.code !== 'ER_DUP_ENTRY')
								return reject(err);
							arr[i] = null;
						});
						return resolve(results);
					});
				} catch (err) {
					return reject(err);
				}
			})
		});
	},

	getBalanceByAddress: function(address) {
		return new Promise(async function(resolve, reject) {
			try {
				await bitcoinServices.listenToAddress(address);

				var balance = 0;
				var unspent = await bitcoinClient.listUnspent(0, BITCOIN_MAX_CONFIRMATIONS, [address]);

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

	getReceivedByAddress: function(address, confirmations) {
		return new Promise(async function(resolve, reject) {
			try {
				await bitcoinServices.listenToAddress(address);

				var received = await bitcoinClient.getReceivedByAddress(address, confirmations);
				return resolve(received);
			} catch (err) {
				return reject(err);
			}
		});
	},
}
