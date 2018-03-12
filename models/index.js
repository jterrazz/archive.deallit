let configMysql = require('../config/mysql.json');

const logger = require('../libs/logger');
const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');
const pool = mysql.createPool(configMysql);
const poolPromise = mysqlPromise.createPool(configMysql);

testConnection();

async function testConnection() {
	try {
		await poolPromise.query('SELECT 1 + 1 AS solution');
		logger.info("MySQL connected");
	} catch (err) {
		if (err && err.code == 'ECONNREFUSED') {
			logger.error("Mysql not connected");
			setTimeout(testConnection, 3000);
		} else if (err) {
			logger.error(err);
		}
	}
};

/**
 * Transaction wrapper
 */

pool.ftTransaction = function(body) {
	return new Promise((resolve, reject) => {
		poolPromise.getConnection()
			.then(async connection => {
				try {
					await connection.query('START TRANSACTION');
					var todo = body(connection);
					await Promise.all(todo);
					await connection.query('COMMIT');
					return resolve();
				} catch (err) {
					connection.query('ROLLBACK');
					return reject(err);
				}
			})
			.catch(err => {
				return reject(err);
			})
	});
}

module.exports = {
	pool,
	poolPromise
};
