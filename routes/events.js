// TODO !!!!!!!!!!!!! CONTROL ORIGIN (ip of bitcoin node only)
const router = require('express').Router(),
	Events = require('../plugins/events'),
	dbUser = require('../store/user'),
	env = require('../config/env');

router.post('/transactions', (req, res) => {
	var transaction = {
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
			Events.emit(`user-${ userId }:bitcoin-transaction`, transaction);

			if (transaction.confirmations == 2) {
				// Check confirmations from multiple sources
				dbUser.saveDeposit(userId, env.devMode ? 'tBTC' : 'BTC', transaction.hash, transaction.value)
					.then(data => {

					})
					.catch(err => {
						console.log(err);
					})
			}
		})
		.catch(err => {

		})
	res.end();
})

module.exports = router;
