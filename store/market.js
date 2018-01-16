const	pool =		require('../store'),
		Boom =		require('boom'),
		analyse =	require('../plugins/analyse')

module.exports = {
	getInfos: async (userId) => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM users WHERE user_id = ?", [userId], (err, ret) => {
				if (err)
					return reject(err)
				else if (!ret.length)
					return reject(Boom.resourceGone('User not found in db'))

				//TODO remove password from data !!!!!!!!!! (SELECT ONLY USEFULL)
				resolve(ret[0])
			})
		})
	},
	getLastProducts: async (userId) => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM products WHERE creator_id = ?", [userId], (err, ret) => {
				if (err)
					return reject(err)

				analyse.images(ret)
				resolve(ret)
			})
		})
	}
}
