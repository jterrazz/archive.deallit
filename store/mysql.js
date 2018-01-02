let		configMysql =	require('../config/mysql.json')

const	mysql =			require('mysql'),
		pool =			mysql.createPool(configMysql)

module.exports = pool
