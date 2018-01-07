const	pool =		require('../store'),
		Boom =		require('boom')

const user = {
	getInfos: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM users WHERE user_id= ?";

			pool.query(query, [userId], (err, data) => {
				if (err)
					reject(Boom.serverUnavailable('Tried getting infos for a user_id'))
				else if (!data.length)
					reject(Boom.resourceGone('User not found in database'))
				resolve(data[0])
			})
		})
	}
}

module.exports = user
