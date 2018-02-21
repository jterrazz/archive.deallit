//#Security:0 !!!!!!!!!!!!! CONTROL ORIGIN (ip of bitcoin node only)
const router = require('express').Router(),
	Events = require('../plugins/events'),
	dbUser = require('../store/user'),
	env = require('../config/env');

// TODO:80 Do better URL
//#Security:20 Refactor file w await

router.post('/transactions', (req, res) => {
	var transaction = {
		currency: env.devMode ? 'tBTC' : 'BTC',
		hash: req.body.data.hash,
		confirmations: req.body.data.confirmations,
	};
	var addressesObj = req.body.addresses;
	var adresses = Object.keys(addressesObj);
	if (adresses.length !== 1)
		return;
	transaction.value = addressesObj[adresses[0]];
	//Listen for adress directly and not sql call ? probably not because of adding funds to user
	dbUser.getUserForWalletAdresses(adresses)
		.then(userId => {
			Events.emit(`user-${ userId }:deposit`, transaction);

			if (transaction.confirmations == 2) {
				// Check confirmations from multiple sources
				dbUser.saveDeposit(userId, transaction.currency, transaction.hash, transaction.value)
					.then(data => {
						dbUser.tryPayingOrders(userId, transaction.currency)
							.then(orders => {
								Events.emit(`user-${ userId }:order-confirmation`, orders);
							})
							.catch(err => {
								console.log(err);
							})
					})
					.catch(err => {
						console.log(err);
					})
			}
		})
		.catch(err => {
			console.log(err);
		})
	res.end();
})

module.exports = router;
