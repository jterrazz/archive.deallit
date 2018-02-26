let		env =			require('../config/env');

const	findRemove =	require('find-remove'),
		pool =			require('../store'),
		bitcoin =		require('./bitcoin');

var pendingOrders = [];
bitcoin.checkDeposits(["17PgWSJWWpFdd2B84upjpdLavPciNxxBvy", "19Vhg1oL3XZgZD118sJspgpNxVusDZBwB7", "1AKxFASN1ji7MtYPgwsXJwqjQMSiKh9hMb"]);

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
