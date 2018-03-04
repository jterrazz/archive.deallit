const bitcoinClient = require('./client'),
	bitcoinServices = require('./services'),
	pool = require('../../../store').poolPromise,
	env = require('../../../config/env'),
	dbUser = require('../../../store/user'),
	redisClient = require('../../redis'),
	bitcoinLib = require('./services');

const BITCOIN_MAX_CONFIRMATIONS = 999999999;
const PREFIX_BITCOIN_UNCONFIRMED_TRANSACTION = "//bitcoin-transaction-unconfirmed:"; // TODO GENERAL var
const BITCOIN_CONFIRMATIONS = 2;
const SATOSHI_UNITS = 100000000;
const BITCOIN_MAX_CONFIRMATION_TIME = 60 * 60 * 24;

module.exports = {
	hardUpdateUnconfirmedTransactions: async function() {
		var unspent = await bitcoinClient.listUnspent(0, BITCOIN_CONFIRMATIONS - 1);

		// Send to redis
		var multi = redisClient.multi();
		for (var i = 0; i < unspent.length; i++) {
			multi.set(PREFIX_BITCOIN_UNCONFIRMED_TRANSACTION + unspent[i].address + '.' + unspent[i].txid, unspent[i].amount, 'EX', BITCOIN_MAX_CONFIRMATION_TIME);
		}
		await multi.execAsync();
	},

	// TODO Optimisation ?
	// Save last block the hard update was made
	hardUpdateConfirmedTransactions: async function() {
		var [dbWallets] = await pool.query("SELECT public_address, total_received, user_id FROM user_wallets WHERE type=?", [env.devMode ? 't_btc' : 'btc']);
		var ftGetReceived = [];
		var ftGetNewReceived = [];
		var ftUpdateDeposits = [];
		var unspentUsers = [];

		// 1st: Check real confirmed deposits from Bitcoin Node
		for (var i = 0; i < dbWallets.length; i++) {
			ftGetReceived[i] = this.getReceivedByAddress(dbWallets[i].public_address, BITCOIN_CONFIRMATIONS);
		}
		var realWallets = await Promise.all(ftGetReceived);

		// 2nd: If different from DB wallet, get all the deposits for this address
		for (var i = 0; i < dbWallets.length; i++) {
			if (dbWallets[i].total_received !== realWallets[i]) {
				unspentUsers.push(dbWallets[i].user_id)
				ftGetNewReceived.push(bitcoinClient.listUnspent(BITCOIN_CONFIRMATIONS, BITCOIN_MAX_CONFIRMATIONS, [dbWallets[i].public_address]));
			}
		}
		var unspentArray = await Promise.all(ftGetNewReceived);

		// 3rd: Save the deposits in DB (some will send errors with duplicate hashes but its ok)
		unspentArray.forEach((addressTx, j) => {
			for (var i = 0; i < addressTx.length; i++) {
				var deposit = {
					valueDeposit: addressTx[i].amount * SATOSHI_UNITS,
					userId: unspentUsers[j],
					currency: (env.devMode ? 't_btc' : 'btc'),
					hash: addressTx[i].txid
				};
				ftUpdateDeposits.push(dbUser.saveDeposit(deposit, addressTx[i].address));
			}
		})

		var results = await Promise.settle(ftUpdateDeposits);
		results.forEach(function(res, i, arr) {
			if (res.status !== 'rejected' || (typeof res.e == 'object' && res.e.code == 'ER_DUP_ENTRY'))
				arr[i] = null;
			else
				throw res.e;
		});
		return results;
	},

	getBalanceByAddress: async function(address) {
		await bitcoinServices.listenToAddress(address);

		var balance = 0;
		var unspent = await bitcoinClient.listUnspent(0, BITCOIN_MAX_CONFIRMATIONS, [address]);

		unspent.forEach(transaction => {
			if (transaction.confirmations >= BITCOIN_CONFIRMATIONS)
				balance += transaction.amount;
		})
		return balance;
	},

	getReceivedByAddress: async function(address, confirmations) {
		await bitcoinServices.listenToAddress(address);

		var received = await bitcoinClient.getReceivedByAddress(address, confirmations);
		return received;
	},
}
