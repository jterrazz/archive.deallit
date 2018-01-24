let		configMysql =	require('../config/mysql.json');

const	mysql =			require('mysql'),
		pool =			mysql.createPool(configMysql);

testConnection();

function testConnection() {
	pool.query('SELECT 1 + 1 AS solution', (err) => {
		if (err && err.code == 'ECONNREFUSED') {
			console.log("Mysql not connected");
			setTimeout(function () {
				testConnection()
			}, 3000);
		} else if (err) {
			console.log(err);
		} else {
			console.log("Connected to Mysql");
		}
	});
};

module.exports = pool;
