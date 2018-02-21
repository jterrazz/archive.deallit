const	pool =		require('../store'),
		analyzer =	require('../plugins/analyzer'),
		Boom =		require('boom'),
		snakeCase =	require('snake-case'),
		snakeCaseKeys = require('snakecase-keys');

const user = {
	get: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM users WHERE user_id= ?";

			pool.query(query, [userId], (err, data) => {
				if (err)
					return reject(Boom.serverUnavailable('Tried getting infos for a user_id'))
				else if (!data.length)
					return reject(Boom.resourceGone('User not found in database'))
				delete data[0].password

				analyzer.imagesURL(data)
				resolve(data[0])
			})
		})
	},

	patch: (userId, userData) => {
		return new Promise((resolve, reject) => {
			var query = "UPDATE users SET ? WHERE user_id = ?";

			pool.query(query, [snakeCaseKeys(userData), userId], (err, ret) => {
				if (err)
					return reject(err);
				else if (ret.affectedRows !== 1)
					return reject(Boom.notFound('Tried updating a user that dont exist or updated more than one'));

				resolve();
			})
		})
	},

	delete: (userId) => {

	},

	getConversations: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT m.*, u.user_id, u.first_name, u.last_name, u.user_image FROM messages m " +
				`LEFT JOIN users u ON u.user_id=m.from_id AND m.from_id != ? ` +
				`OR u.user_id=m.to_id AND m.to_id != ? ` +
				"WHERE m.message_id IN (" +
					"SELECT max(m.message_id) FROM messages m WHERE to_id = ? OR from_id = ? GROUP BY least(m.to_id, m.from_id), greatest(m.to_id, m.from_id)" +
				") ORDER BY m.message_id DESC";

			pool.query(query, [userId, userId, userId, userId], (err, data) => {
				if (err)
					return reject(err);
				analyzer.imagesURL(data);
				resolve(data);
			})
		})
	},

	getNotifications: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM user_notifications WHERE user_id=?"

			pool.query(query, [userId], (err, data) => {
				if (err)
					return reject(err)
				resolve(data)
			})
		});
	},

	getMessages: (userId, contactId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM messages m WHERE ? IN (m.from_id, m.to_id) AND ? IN (m.from_id, m.to_id) LIMIT 20";

			pool.query(query, [userId, contactId], (err, data) => {
				if (err)
					return reject(err)
				resolve(data)
			})
		})
	},

	postMessage: (fromId, toId, message) => {
		return new Promise((resolve, reject) => {
			var data = {
				message: message,
				from_id: fromId,
				to_id: toId
			}
			pool.query("INSERT INTO messages SET ?", [data], (err, data) => {
				if (err)
					return reject(err)
				else if (data.affectedRows !== 1)
					return (Boom.notAcceptable())
				return resolve()
			})
		});
	},

	insertOrder: (order) => {
		return new Promise((resolve, reject) => {
			pool.query("INSERT INTO orders SET ?", snakeCaseKeys(order), (err, ret) => {
				if (err)
					return reject(err);
				else if (ret.affectedRows !== 1)
					return Boom.notAcceptable("Nothing was inserted");

				return resolve();
			})
		});
	},

	getOrders: (userId) => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM orders o LEFT JOIN products p ON o.product_id=p.product_id WHERE o.user_id=?", [userId], (err, data) => {
				if (err)
					return reject(err);
				return resolve(data);
			})
		});
	},

	getOrder: (orderId) => {
		return new Promise(function(resolve, reject) {
			pool.query("SELECT * FROM orders o LEFT JOIN products p ON o.product_id=p.product_id WHERE o.order_id=?", [orderId], (err, data) => {
				if (err)
					return reject(err);
				if (!data.length)
					return Boom.notFound();
				return resolve(data[0]);
			})
		});
	},

	cancelOrder: (userId, orderId) => {
		return new Promise(function(resolve, reject) {
			pool.query("UPDATE orders SET canceled=1 WHERE order_id=? AND user_id=?", [orderId, userId], (err, data) => {
				if (err)
					return reject(err);
				else if (data.affectedRows !== 1)
					return Boom.notAcceptable();
				return resolve();
			})
		});
	},

	getNbMessages: (userId, lastId) => {
		return new Promise(function(resolve, reject) {
			var query = "SELECT COUNT(message_id) AS nb_messages FROM messages WHERE message_id>? AND to_id=?";
			lastId = lastId ? lastId : 0;

			pool.query(query, [lastId, userId], (err, data) => {
				if (err)
					return reject(err);
				else if (!data.length)
					return reject(Boom.notAcceptable());
				resolve(data[0].nb_messages);
			});
		});
	},

	getNbNotifications: (userId, lastId) => {
		return new Promise(function(resolve, reject) {
			var query = "SELECT COUNT(notification_id) AS nb_notifications FROM user_notifications WHERE notification_id>? AND user_id=?";
			lastId = lastId ? lastId : 0;

			pool.query(query, [lastId, userId], (err, data) => {
				if (err)
					return reject(err);
				else if (!data.length)
					return reject(Boom.notAcceptable());
				resolve(data[0].nb_notifications);
			});
		});
	},

	saveWallet: (type, userId, publicAddress, wif, isSegwit) => {
		return new Promise(function(resolve, reject) {
			var query = "INSERT INTO user_wallets SET ?";
			var dataSql = { type, user_id: userId, publicAddress, wif, isSegwit };

			pool.query(query, dataSql, (err, data) => {
				if (err)
					return reject(err);
				else if (!data.affectedRows)
					return (Boom.notAcceptable());
				resolve();
			})
		});
	},

	getWalletForUser: (userId, currency, isSegwit) => {
		return new Promise(function(resolve, reject) {
			var query = "SELECT w.public_address FROM user_wallets w " +
			"WHERE w.user_id=? AND w.type=? AND w.is_segwit=? ORDER BY w.wallet_id DESC LIMIT 1";

			pool.query(query, [userId, currency, isSegwit], (err, data) => {
				if (err)
					return reject(err);
				else if (data.length !== 1)
					return reject(Boom.notAcceptable())
				resolve(data[0])
			})
		});
	},

	getUserForWalletAdresses: (adresses) => {
		return new Promise(function(resolve, reject) {
			var query = "SELECT user_id FROM user_wallets WHERE public_address IN (?)";

			pool.query(query, [adresses], (err, data) => {
				if (err)
					return reject(err);
				else if (data.length !== 1)
					return reject(Boom.notAcceptable)
				resolve(data[0].user_id);
			})
		});
	},

	saveDeposit: (userId, type, hash, value) => {
		return new Promise(function(resolve, reject) {
			pool.query("INSERT INTO user_deposits SET ?", { value, user_id: userId, type, hash }, (err, data) => {
				if (err)
					return reject(console.log(err));
				else if (data.affectedRows != 1)
					return reject(Boom.notAcceptable());

				var query = "";
				switch (type) {
					case 'BTC':
						query = "UPDATE users SET BTC_amount = BTC_amount + ? WHERE user_id=?";
						break;
					case 'tBTC':
						query = "UPDATE users SET tBTC_amount = tBTC_amount + ? WHERE user_id=?";
						break;
					default:
						return reject(Boom.notAcceptable())
				}

				pool.query(query, [value, userId], (err, data) => {
					if (err)
						return reject(err)
					resolve(true)
				})
			})
		});
	},

	// TODO:120 Security check currency is always set in our code
	tryPayingOrders: (userId, currency) => {
		return new Promise((resolve, reject) => {
			pool.query(`SELECT ${ currency }_amount AS value FROM users WHERE user_id=?`, [userId], (err, wallets) => {
				if (err)
					return reject(err);
				else if (wallets.length !== 1)
					return Boom.notAcceptable();
				var wallet = wallets[0];
				pool.query("SELECT * FROM orders WHERE payed=0 AND too_late=0 AND user_id=?", [userId], (err, orders) => {
					if (err)
						return reject(err);
					else if (!orders.length)
						return resolve("nothing-to-pay");

					var ordersPayed = [];
					var stop = false;
					orders.forEach(order => {
						// TODO:70 DO ETH TOO
						if (!stop && wallet.value - order.to_pay_BTC >= 0) {
							wallet.value -= order.to_pay_BTC;
							ordersPayed.push(order.order_id);
						} else {
							stop = true;
						}
					})
					return resolve(ordersPayed);
					// Transfert wallet money and save order confirmed in DB
				})
			})
		});
	}
}

module.exports = user;
