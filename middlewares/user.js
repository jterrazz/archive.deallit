const db =		require('../store/mysql')
// escape all mysql input data

const user = {
	getInfos: (req, res, next) => {
		db.query("SELECT * FROM users WHERE user_id=" + req.params.userId, (err, data) => {
			if (err || !data.length)
				return res.sendStatus(400)
			req.userSearched = data[0]
			next()
		})
	}
}

module.exports = user
