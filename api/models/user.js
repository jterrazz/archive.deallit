const	Boom =			require('boom'),
		pool =			require('./index').pool,
		poolPromise =			require('./index').poolPromise,
		env =			require('../config/env'),
		analyzer =		require('../libs/analyzer'),
		Joi =			require('joi'),
		snakeCaseKeys =	require('snakecase-keys');

const user = {
	get: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM users WHERE user_id= ?";

			pool.query(query, [userId], (err, data) => {
				if (err)
					return reject(Boom.serverUnavailable('Tried getting infos for a user_id'));
				else if (!data.length)
					return reject(Boom.resourceGone('User not found in database'));
				delete data[0].password;

				analyzer.decodeImagesURL(data);
				resolve(data[0]);
			})
		})
	},

	patch: (userId, userData) => {
		return new Promise((resolve, reject) => {
			var query = "UPDATE users SET ? WHERE user_id = ?";

			pool.query(query, [snakeCaseKeys(userData), userId], (err, ret) => {
				if (err && err.errno == 1062)
					return reject(Boom.conflict("Duplicate entry"));
				else if (err)
					return reject(err);
				else if (ret.affectedRows !== 1)
					return reject(Boom.notFound('Tried updating a user that dont exist or updated more than one'));

				resolve();
			})
		})
	},

	delete: (userId) => {

	},

	followStore: async (userId, followedId) => {
		try {
			await poolPromise.query("INSERT INTO follows SET ?", snakeCaseKeys({ userId, followedId }));
		} catch (err) {
			if (err.code == 'ER_DUP_ENTRY')
				return;
			throw err;
		}
	},

	unfollowStore: async (userId, followedId) => {
		await poolPromise.query("DELETE FROM follows WHERE user_id=? AND followed_id=?", [userId, followedId]);
	},

	getConversations: function(userId) {
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
				analyzer.decodeImagesURL(data);
				resolve(data);
			})
		})
	},

	getNotifications: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM user_notifications WHERE user_id=?";

			pool.query(query, [userId], (err, data) => {
				if (err)
					return reject(err);
				analyzer.decodeNotifications(data);
				resolve(data);
			})
		});
	},

	getMessages: (userId, contactId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM messages m WHERE ? IN (m.from_id, m.to_id) AND ? IN (m.from_id, m.to_id) LIMIT 20";

			pool.query(query, [userId, contactId], (err, data) => {
				if (err)
					return reject(err);
				resolve(data);
			})
		})
	},

	postMessage: (fromId, toId, message) => {
		return new Promise((resolve, reject) => {
			var data = {
				message: message,
				from_id: fromId,
				to_id: toId
			};
			pool.query("INSERT INTO messages SET ?", [data], (err, data) => {
				if (err)
					return reject(err);
				else if (data.affectedRows !== 1)
					return (Boom.notAcceptable("No or too many messages inserted"));
				return resolve();
			})
		});
	},

	getTwoFA: (userId) => {
		return new Promise(function(resolve, reject) {
			var query = "SELECT two_fa_secret FROM users WHERE user_id=?";

			pool.query(query, userId, (err, data) => {
				if (err)
					return reject(err);
				else if (!data.length)
					return reject(Boom.badData("No user found"));
				return resolve(data[0].two_fa_secret);
			})
		});
	},

	saveTwoFA: (userId, secret) => {
		return new Promise(function(resolve, reject) {
			var query = "UPDATE users SET two_fa_secret=? WHERE user_id=? AND two_fa_secret IS NULL";

			pool.query(query, [secret, userId], (err, data) => {
				if (err)
					return reject(err);
				else if (data.affectedRows == 0)
					return reject(Boom.badImplementation("No change"));
				else if (data.affectedRows > 1)
					return reject(Boom.badImplementation());
				resolve();
			})
		});
	},

	removeTwoFA: (userId) => {
		return new Promise(function(resolve, reject) {
			pool.query("UPDATE users SET two_fa_secret=NULL WHERE user_id=?", userId, (err, data) => {
				if (err)
					return reject(err)
				else if (!data.affectedRows)
					return reject(Boom.badImplementation("No change"));
				resolve();
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
			pool.query("SELECT * FROM orders o LEFT JOIN products p ON o.product_id=p.product_id WHERE o.user_id=?", [userId], (err, orders) => {
				if (err)
					return reject(err);
				analyzer.decodeImagesURL(orders);
				return resolve(orders);
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

	/**
	 * !!! Wallets methods !!!
	 * -> Extra input verifications
	 */

	saveWallet: async (type, userId, publicAddress, wif, isSegwit) => {
		const schema1 = Joi.string().required();
		const schema2 = Joi.number().required();
		const schema3 = Joi.boolean().required();
		await schema1.validate(type);
		await schema2.validate(userId);
		await schema1.validate(publicAddress);
		await schema1.validate(wif);
		await schema3.validate(isSegwit);

		var query = "INSERT INTO user_wallets SET ?";
		var dataSql = {
			type,
			user_id: userId,
			public_address: publicAddress,
			wif,
			is_segwit: isSegwit
		};

		var [data] = await poolPromise.query(query, dataSql);
		if (!data.affectedRows)
			throw Boom.notAcceptable("Wallet not saved");
	},

	getPublicAddress: async (userId, currency, isSegwit) => {
		const schema1 = Joi.number().required();
		const schema2 = Joi.string().required();
		const schema3 = Joi.boolean().required();
		await schema1.validate(userId);
		await schema2.validate(currency);
		await schema3.validate(isSegwit);

		var query = "SELECT w.public_address FROM user_wallets w " +
			"WHERE w.user_id=? AND w.type=? AND w.is_segwit=? ORDER BY w.wallet_id DESC LIMIT 1";
		var [data] = await poolPromise.query(query, [userId, currency, isSegwit]);
		if (data.length == 0)
			return null;
		return data[0].public_address;
	},

	getUserForWalletAdresses: async (addresses) => {
		const schema = Joi.array().items(Joi.string()).single().min(1).required();
		await schema.validate(addresses);

		var query = "SELECT user_id FROM user_wallets WHERE public_address IN (?)";
		var [data] = await poolPromise.query(query, [addresses]);
		if (data.length !== 1)
			throw Error("NO_USER");
		return data[0].user_id;
	},

	saveDeposit: async (transaction, address) => {
		const schema1 = Joi.object({
			valueDeposit: Joi.number().required(),
			userId: Joi.number().required(),
			currency: Joi.string().required(),
			hash: Joi.string().required()
		})
		const schema2 = Joi.string().required();
		await schema1.validate(transaction);
		await schema2.validate(address);

		return new Promise(function(resolve, reject) {
			var value = transaction.valueDeposit;
			if (!address)
				return reject(Error("no-address"));

			pool.ftTransaction(function(conn) {
				return [
					conn.query("INSERT INTO user_transactions SET ?", snakeCaseKeys(transaction)),
					conn.query("UPDATE user_wallets SET balance = balance + ?, total_received = total_received + ? WHERE public_address=?", [value, value, address]),
					conn.query(`UPDATE users SET amount_${transaction.currency} = amount_${transaction.currency} + ? WHERE user_id=?`, [value, transaction.userId])
				]
			}).catch(err => {
				return reject(err);
			}).then(() => {
				return resolve();
			})
		});
	},

	// TODO BE FUCKING SURE CANT PAY BECAUSE OF STUPID DELAY OF SELECT
	// TODO:120 Security check currency is always set in our code
	checkAndPayPendingOrders: async function(userId, currency) {
		const schema1 = Joi.number().required();
		const schema2 = Joi.string().required();
		await schema1.validate(userId);
		await schema2.validate(currency);

		return new Promise((resolve, reject) => {
			pool.query(`SELECT amount_${ currency } AS value FROM users WHERE user_id=?`, userId, (err, wallets) => {
				if (err)
					return reject(err);
				else if (wallets.length !== 1)
					return resolve(null); // TODO Return error modified

				var wallet = wallets[0]; // TODO Add Price XXXX Is defined in select orders
				var query = `SELECT o.*, u.user_id AS seller_id FROM orders o INNER JOIN products p ON p.product_id=o.product_id INNER JOIN users u ON u.user_id = p.creator_id WHERE o.prefered_payment='crypto' AND o.payed=0 AND o.date > (NOW() - INTERVAL ${ env.ORDER_VALIDITY } MINUTE) AND o.user_id=?`;
				pool.query(query, [userId], (err, orders) => {
					if (err)
						return reject(err);
					else if (!orders.length)
						return resolve("no-orders"); // TODO Better
					var ordersToPay = [];
					var stop = false;
					orders.forEach(order => {
						// TODO:70 DO ETH TOO
						if (!stop && wallet.value - order.price_btc >= 0) {
							wallet.value -= order.price_btc;
							ordersToPay.push(order);
						} else {
							stop = true;
						}
					})
					this.payOrders(currency, ordersToPay, 0, [], function(err, ordersDone) {
						if (err)
							return reject(err);
						return resolve({ userId, ordersDone });
					})
				})
			})
		});
	},

	payOrders: function(currency, orders, i, ordersDone, callback) {
		const schema1 = Joi.string().required();
		const schema2 = Joi.array(Joi.number()).required();

		if (i >= orders.length || !schema1.validate(currency) || !schema2.validate(orders)) {
			return callback(null, ordersDone);
		} else {
			var order = orders[i];
			var query = "INSERT INTO user_transactions SET ?";
			var currencyWOTest = ['t_btc', 't_eth'].includes(currency) ? currency.substring(2) : currency;
			var payment = {
				valueLocalSent: order[`price_${ currencyWOTest }`],
				userId: order.user_id,
				currency: currency,
				orderId: order.order_id
			}
			var income = {
				valueLocalReceived: order[`price_${ currencyWOTest }`],
				userId: order.seller_id,
				currency: currency,
				orderId: order.order_id
			}

			pool.ftTransaction(function(conn) {
				return [
					conn.query(query, snakeCaseKeys(payment)),
					conn.query(query, snakeCaseKeys(income)),
					conn.query(`UPDATE users SET amount_${ currency } = amount_${ currency } - ? WHERE user_id=?`, [ payment.valueLocalSent, order.user_id ]),
					conn.query(`UPDATE users SET amount_${ currency } = amount_${ currency } + ? WHERE user_id=?`, [ payment.valueLocalSent, order.seller_id ]),
					conn.query("UPDATE orders SET payed=1 WHERE order_id = ?", [ order.order_id ]),
				]
			}).catch(err => {
				return callback(err);
			}).then(() => {
				ordersDone.push(orders[i].order_id);
				this.payOrders(currency, orders, i + 1, ordersDone, callback);
			})
		}
	}
}

module.exports = user;
