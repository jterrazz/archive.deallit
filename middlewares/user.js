const pool =		require('../store/mysql')

const user = {
	getInfos: (req, res, next) => {
		pool.query("SELECT * FROM users WHERE user_id=" + pool.escape(req.params.userId), (err, data) => {
			if (err || !data.length)
				return res.sendStatus(400)
			req.userSearched = data[0]
			next()
		})
	}
}

module.exports = user
