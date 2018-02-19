const	pool =			require('../store'),
		fs =			require('fs'),
		bcrypt =		require('bcrypt'),
		validator =		require('validator'),
		jwt =			require('jsonwebtoken'),
		g =				require('../config/env'),
		Boom =			require('boom')

const	cert =			fs.readFileSync('config/jwt.key')

const auth = {
	login: (req, res, next) => {
		const user = {
			mail: req.body.mail,
			password: req.body.password
		}

		if (req.user || !user || !user.mail || !validator.isEmail(user.mail) || !user.password)
			return res.sendStatus(400)

		pool.query("SELECT * FROM users WHERE ?", { mail: user.mail }, (err, ret) => {
			if (err)
				return res.sendStatus(500)
			else if (!ret.length)
				return res.status(403).send("This mail doesn't match any user")

			bcrypt.compare(user.password, ret[0].password, (err, isValid) => {
				if (err || !isValid)
					return res.status(403).send("Incorrect password")

				var payload = {
					userId: ret[0].user_id
				}
				delete payload.password
				payload.exp = Math.floor(Date.now() / 1000) + (g.tokenDuration)

				jwt.sign(payload, cert, { algorithm: 'HS512' }, (err, token) => {
					if (err)
						return res.status(500).send("Token creation error")
					res.json({ token })
				})
			})
		})
	},

	register: (req, res, next) => {
		const user = req.body

		if (req.user || !user || !user.mail || !validator.isEmail(user.mail) || !user.password)
			return res.sendStatus(400)

		var newUser = {
			mail: user.mail,
			password: user.password,
		}

		pool.getConnection((err, connection) => {
			if (err)
				return res.sendStatus(500)

			connection.query("SELECT * FROM users WHERE mail = ?", newUser.mail, (err, data) => {
				if (err || data.length) {
					connection.release()
					return res.sendStatus(500)
				}
				bcrypt.hash(newUser.password, g.saltRounds, (err, hash) => {
					if (err) {
						connection.release()
						return res.status(400).send('New user: Error in bcrypt hash')
					}
					newUser.password = hash;

					connection.query("INSERT INTO users SET ?", newUser, (err, data) => {
						connection.release()
						if (err)
							return res.status(400).send('Cant insert user in DB')
						res.sendStatus(200)
					})
				})
			})
		})
	},

	setUser: (req, res, next) => {
		req.user = null

		if (req.headers.authorization) {
			var parts = req.headers.authorization.split(' ');

			if (parts.length == 2) {
				var scheme = parts[0],
					credentials = parts[1];

				if (/^Bearer$/i.test(scheme)) {
					jwt.verify(credentials, cert, (err, decoded) => {
						if (!err) {
							req.user = decoded;
						}
					})
				}
			}
		}
		next()
	},

	requireUser: (req, res, next) => {
		if (!req.user)
			return res.sendStatus(403) // TODO:140 better err
		next()
	}
}

// TODO:150 case where 2 users create user at same time -> do unique key in mysql for mail user

module.exports = auth
