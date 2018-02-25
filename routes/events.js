//#Security:0 !!!!!!!!!!!!! CONTROL ORIGIN (ip of bitcoin node only)
//# DONT LISTEN TO THIS ON MAIN SERVER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (hacker can send this info)
const	router =		require('express').Router(),
		Events =		require('../plugins/events-handler'),
		dbUser =		require('../store/user'),
		asyncHandler =	require('../middlewares/async'),
		auth =			require('../middlewares/auth'),
		env =			require('../config/env');

// TODO:80 Do better URL
//#Security:20 Refactor file w await

router.post('/transactions', asyncHandler(async (req, res, next) => { //, auth.requireUser
	req.user = {
		userId: 5
	}; // DELETE



	var transaction = {
		currency: env.devMode ? 't_btc' : 'btc',
		hash: req.body.data.hash,
		confirmations: req.body.data.confirmations,
	};
	var addressesObj = req.body.addresses;
	var adresses = Object.keys(addressesObj);
	if (adresses.length !== 1)
		return next(Boom.implementation("Cant reveive 2 adresses for a transaction")); // TODO Deal better with errors
	transaction.value = addressesObj[adresses[0]];

	//Listen for adress directly and not sql call ? probably not because of adding funds to user
	var userId = dbUser.getUserForWalletAdresses(adresses);
	Events.emit(`user-${ userId }:deposit`, transaction);

	if (transaction.confirmations >= 2) {
		// Check confirmations from multiple sources
		var transactionSql = {
			valueDeposit: transaction.value,
			userId: req.user.userId,
			currency: transaction.currency,
			hash: transaction.hash
		}
		await dbUser.saveTransaction(transactionSql);
		var orders = await dbUser.checkAndPayPendingOrders(req.user.userId, transaction.currency);
		Events.emit(`user-${ userId }:order-confirmation`, orders);
	}
	res.end();
}))

module.exports = router;
