const	pool =		require('../store'),
		Boom =		require('boom'),
		analyse =	require('../plugins/analyse')

module.exports = {
	get: (type, id) => {
		return new Promise((resolve, reject) => {
			pool.query(`SELECT * FROM users WHERE ${ type == 'identifier' ? 'market_identifier' : 'user_id' } = ?`, [id], (err, ret) => {
				if (err)
					return reject(err)
				else if (!ret.length)
					return reject(Boom.resourceGone('User not found in db'))

				//TODO:180 remove password from data !!!!!!!!!! (SELECT ONLY USEFULL)
				analyse.images(ret)
				resolve(ret[0])
			})
		})
	},

	patch: (userId, market) => {
		return new Promise((resolve, reject) => {
			pool.query("UPDATE users SET ? WHERE user_id = ?", [market, userId], (err, data) => {
				if (err)
					return reject(err)
				else if (data.affectedRows !== 1)
					return reject(Boom.notAcceptable())
				resolve()
			})
		});
	},

	getTags: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT pt.tag, COUNT(pt.tag) AS nb FROM product_tags pt " +
				"LEFT JOIN products p ON p.product_id = pt.product_id WHERE p.creator_id = ? GROUP BY pt.tag";

			pool.query(query, [userId], (err, data) => {
				if (err)
					return reject(err)
				resolve(data)
			})
		});
	},
}
