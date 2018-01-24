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
			// var query = "SELECT m.*, u.user_image, u.first_name, u.last_name " +
			// 	"FROM messages m LEFT JOIN users u ON u.user_id=m.from_id " +
			// 	"WHERE m.from_id=? OR m.to_id=? GROUP BY m.from_id";
            //
			// pool.query(query, [userId, userId], (err, data) => {
			// 	if (err)
			// 		return reject(err);
			// 	analyse.images(data);
				// resolve(data);
			// })
			resolve([])
		})
	},

	getMessages: (userId, contactId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM messages WHERE (user_id=? AND contact_id=?) OR (user_id=? AND contact_id=?) LIMIT 20";

			pool.query(query, [userId, contactId, contactId, userId], (err, data) => {
				if (err)
					return reject(err)
				resolve(data)
			})
		})
	},

	postMessage: (userId, contactId, message) => {
		return new Promise((resolve, reject) => {
			var data = {
				message: message,
				user_id: userId,
				contact_id: contactId
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

	}
}

module.exports = user
