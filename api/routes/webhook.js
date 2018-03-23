const	Events =		require('../libs/events'),
		bitcoinLib =	require('../libs/currencies/bitcoin'),
		bitcoinClient =	require('../libs/currencies/bitcoin/client'),
		dbUser =		require('../models/user'),
		redisClient =	require('../libs/redis'),
		asyncHandler =	require('../middlewares/async'),
		auth =			require('../middlewares/auth'),
		zmq =			require('zeromq'),
		env =			require('../config/env');

/**
 * If event is missed, libs/tasks will eventually check addresses
 */

 //#Security:0 !!!!!!!!!!!!! CONTROL ORIGIN (ip of bitcoin node only)

const sub = zmq.socket('sub');

sub.subscribe('rawtx');
sub.subscribe('rawblock');
sub.connect('tcp://127.0.0.1:28332');

const handleTx = function(rawTx){
	var tx = bitcoinLib.utils.decodeRawTransaction(rawTx);

	if (!tx.outputs.length)
		return;
	tx.outputs.forEach(async output => {
		var addresses = output.scriptPubKey.addresses;
		if (addresses.length != 1)
			return;
		var address = addresses[0];
		try {
			var userId = await dbUser.getUserForWalletAdresses(addresses);
			await redisClient.setAsync(env.PREFIX_BITCOIN_UNCONFIRMED_TRANSACTION + address + '.' + tx.id, output.satoshi);
			var transaction = {
				currency: env.devMode ? 't_btc' : 'btc',
				hash: tx.id,
				confirmations: 0,
			};
			Events.emit(`user-${ userId }:deposit`, transaction);
		} catch (err) {
			// TODO Log error if != no user
		}
	})
}

const handleNewBlock = async function() {
	try {
		// 1. Get the unconfirmed transactions list
		var unconfirmed = await redisClient.keysAsync(env.PREFIX_BITCOIN_UNCONFIRMED_TRANSACTION + '*');

		// 2. Check their status
		var unconfirmedFt = [];
		unconfirmed.forEach(tx => {
			var txSplitted = tx.split('.');
			if (txSplitted.length !== 2)
				return // TODO Remove it
			var id = txSplitted[1];
			unconfirmedFt.push(bitcoinClient.getTransaction(id, true));
		})
		var results = await Promise.all(unconfirmedFt);

		// TODO This creates double hashes because in dev we have 2 txs ?
		// 3. Add the confirmed ones
		var toInform = [];
		var getUsersToInform = [];
		var toAdd = [];
		var getUsers = [];
		var saveDeposits = [];
		results.forEach(res => {
			if (res.confirmations >= env.BITCOIN_CONFIRMATIONS) {
				res.details.forEach(tx => {
					if (tx.amount > 0) {
						tx.txid = res.txid;
						toAdd.push(tx);
						getUsers.push(dbUser.getUserForWalletAdresses(tx.address))
					}
				})
			} else if (res.confirmations > 0) {
				res.details.forEach(tx => {
					if (tx.amount > 0) {
						tx.txid = res.txid;
						tx.confirmations = res.confirmations;
						toInform.push(tx);
						getUsersToInform.push(dbUser.getUserForWalletAdresses(tx.address))
					}
				})
			}
		})

		// Inform
		var usersToInform = await Promise.all(getUsersToInform);
		usersToInform.forEach((userId, i) => {
			var transaction = {
				currency: env.devMode ? 't_btc' : 'btc',
				hash: toInform[i].txid,
				confirmations: toInform[i].confirmations,
			};
			Events.emit(`user-${ userId }:deposit`, transaction);
		})

		// Save deposists
		var users = await Promise.all(getUsers);
		if (users.length !== toAdd.length)
			return Error("Cant be ok");
		for (let i = 0; i < toAdd.length; i++) {
			var transactionSql = {
				valueDeposit: toAdd[i].amount * env.SATOSHI_UNITS,
				userId: users[i],
				currency: env.devMode ? 't_btc' : 'btc',
				hash: toAdd[i].txid
			}
			var p = new Promise(async function(resolve, reject) {
				try {
					await dbUser.saveDeposit(transactionSql, toAdd[i].address);
					var orders = await dbUser.checkAndPayPendingOrders(users[i], transactionSql.currency);
					Events.emit(`user-${ users[i] }:order-confirmation`, orders);
					unfollowTx(transactionSql.hash);
					return resolve();
				} catch (err) {
					if (err.code == 'ER_DUP_ENTRY')
						return unfollowTx(transactionSql.hash);
					return reject(err);
				}

				async function unfollowTx(tx) {
					try {
						await redisClient.delAsync(env.PREFIX_BITCOIN_UNCONFIRMED_TRANSACTION + toAdd[i].address + '.' + transactionSql.hash);
					} catch (e) {

					}
				}
			})
			saveDeposits.push(p);
		}
		await Promise.all(saveDeposits);

		// OPTI ? var toDeposit = await bitcoinClient.listUnspent(env.BITCOIN_CONFIRMATIONS, env.BITCOIN_CONFIRMATIONS);
		// TODO Check more ?
	} catch (err) {
		console.log(err); // TODO Handle webhook errors
	}
}

sub.on('message', function(header, body){
	if (header == 'rawtx') {
		handleTx(body.toString('hex'));
	} else if (header == 'rawblock') {
		handleNewBlock();
	}
});
