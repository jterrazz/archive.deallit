//#Security:0 !!!!!!!!!!!!! CONTROL ORIGIN (ip of bitcoin node only)
//# DONT LISTEN TO THIS ON MAIN SERVER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (hacker can send this info)
const	router =		require('express').Router(),
		Events =		require('../libs/events'),
		bitcoinLib =	require('../libs/currencies/bitcoin'),
		dbUser =		require('../store/user'),
		asyncHandler =	require('../middlewares/async'),
		auth =			require('../middlewares/auth'),
		zmq =			require('zeromq'),
		env =			require('../config/env');

/**
 * If event is missed, libs/tasks will eventually check addresses
 */

const sub = zmq.socket('sub');

sub.subscribe('rawtx');
sub.connect('tcp://127.0.0.1:28332');

sub.on('message', function(header, body){
	if (header == 'rawtx') {
		console.log(bitcoinLib.utils.decodeRawTransaction(body));;
		// AT FIRST CONNNECTION RESEND EVENTS NOT CONFIRMED
		// console.log(body);
		// Add transaction to temp waiting for confirmations
	}
});


// router.post('/transactions', asyncHandler(async (req, res, next) => {
//
// 	var transaction = {
// 		currency: env.devMode ? 't_btc' : 'btc',
// 		hash: req.body.data.hash,
// 		confirmations: req.body.data.confirmations,
// 	};
// 	var addressesObj = req.body.addresses;
// 	var adresses = Object.keys(addressesObj);
// 	if (adresses.length !== 1)
// 		return next(Boom.implementation("Cant reveive 2 adresses for a transaction")); // TODO Deal better with errors
// 	transaction.value = addressesObj[adresses[0]];
//
// 	//Listen for adress directly and not sql call ? probably not because of adding funds to user
// 	var userId = await dbUser.getUserForWalletAdresses(adresses);
// 	Events.emit(`user-${ userId }:deposit`, transaction);
//
// 	if (transaction.confirmations >= 2) {
// 		// Check confirmations from multiple sources
// 		var transactionSql = {
// 			valueDeposit: transaction.value,
// 			userId: userId,
// 			currency: transaction.currency,
// 			hash: transaction.hash
// 		}
// 		// TODO Check values sent
// 		await dbUser.saveDeposit(transactionSql, adresses[0]);
// 		var orders = await dbUser.checkAndPayPendingOrders(userId, transaction.currency);
// 		Events.emit(`user-${ userId }:order-confirmation`, orders);
// 	}
// 	res.end();
// }))

module.exports = router;
