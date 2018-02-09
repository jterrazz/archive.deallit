const	pool =		require('../store'),
		analyse =	require('../plugins/analyse'),
		Boom =		require('boom')

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

				analyse.images(data)
				resolve(data[0])
			})
		})
	},

	patch: (user, informations) => {
		return new Promise((resolve, reject) => {
			var query = "UPDATE users SET ? WHERE user_id=" + pool.escape(user.userId);

			pool.query(query, informations, (err, ret) => {
				if (err)
					return reject(err)
				else if (ret.affectedRows !== 1)
					return reject(Boom.notFound('Tried updating a user that dont exist or updated more than one'))
				resolve()
			})
		})
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
				analyse.images(data);
				resolve(data);
			})
		})
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

	order: (userId, order) => {
		return new Promise((resolve, reject) => {
			order.user_id = userId;

			pool.query("INSERT INTO orders SET ?", order, (err, data) => {
				if (err)
					return reject(err);
				else if (data.affectedRows !== 1)
					return Boom.notAcceptable();

				//TODO Update product quantity
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

	deleteUser: (userId) => {

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
			var query = "SELECT COUNT(notification_id) AS nb_notifications FROM notifications WHERE notification_id>? AND user_id=?";
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
}

module.exports = user
