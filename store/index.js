let		configMysql =	require('../config/mysql.json')

const	mysql =			require('mysql'),
		pool =			mysql.createPool(configMysql)

pool.on('connection', function(connection) {

});

module.exports = pool
