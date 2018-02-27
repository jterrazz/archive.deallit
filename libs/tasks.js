let		env =			require('../config/env');

const	findRemove =	require('find-remove'),
		pool =			require('../store'),
		bitcoinLib =		require('./currencies/bitcoin');

/**
 * Start up tasks
 */

bitcoinLib.services.hardUpdateMonitoredAddresses();
// bitcoinLib.states.getBalanceByAddress("mtKirnwxrdaXfJKqMhVFpE2hyvvz8ihZ4A")
// 	.then(d => console.log(d))

/**
 * Recuring tasks
 */

 // var pendingOrders = [];
 // HARD CHECK WALLETS ? START + EVERY ?

ftFindRemove();
setInterval(ftFindRemove, 1000 * 60 * 1);

function ftFindRemove(){
	findRemove('uploads', {
		age: {
			seconds: env.TEMP_FILES_MAX_AGE
		},
		extensions: ['']
	})
}

module.exports = {}
