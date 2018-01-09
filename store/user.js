const	pool =		require('../store'),
		Boom =		require('boom')

const user = {
	getInfos: (userId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM users WHERE user_id= ?";

			pool.query(query, [userId], (err, data) => {
				if (err)
					return reject(Boom.serverUnavailable('Tried getting infos for a user_id'))
				else if (!data.length)
					return reject(Boom.resourceGone('User not found in database'))

				resolve(data[0])
			})
		})
	},

	updateInformations: (user, informations) => {
		return new Promise((resolve, reject) => {
			var query = "UPDATE users SET ? WHERE user_id=" + pool.escape(user.user_id);

			pool.query(query, informations, (err, ret) => {
				if (err)
					return reject(err)
				else if (ret.affectedRows !== 1)
					return reject(Boom.notFound('Tried updating a user that dont exist or updated more than one'))
				resolve()
			})
		})
	}
}

module.exports = user
