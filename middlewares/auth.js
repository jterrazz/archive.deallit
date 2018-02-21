const pool = require('../store'),
	fs = require('fs'),
	bcrypt = require('bcrypt'),
	validator = require('validator'),
	jwt = require('jsonwebtoken'),
	env = require('../config/env'),
	Boom = require('boom');

const cert = fs.readFileSync('config/jwt.key');

module.exports = {
	login: (req, res, next) => {
		const user = {
			mail: req.body.mail,
			password: req.body.password
		};

		if (req.user || !user || !user.mail || !validator.isEmail(user.mail) || !user.password)
			return next(Boom.badData("Login informations are missing or are not valid"));

		pool.query("SELECT * FROM users WHERE mail = ?", user.mail, (err, userSql) => {
			if (err)
				return next(err);
			else if (!userSql.length)
				return next(Boom.notFound("This mail is not registred"));

			bcrypt.compare(user.password, userSql[0].password, (err, isValid) => {
				if (err)
					return next(err);
				else if (!isValid)
					return next(Boom.unauthorized("Password incorrect"));

				var payload = {
					exp: Math.floor(Date.now() / 1000) + env.JWT_TOKEN_DURATION,
					userId: userSql[0].user_id,
				};

				jwt.sign(payload, cert, { algorithm: 'HS512' }, (err, token) => {
					if (err)
						return next(err);
					res.json({ token });
				})
			})
		})
	},

	register: (req, res, next) => {
		const user = req.body;
		const newUser = {
			mail: user.mail,
			password: user.password,
		}

		if (req.user || !user || !user.mail || !validator.isEmail(user.mail) || !user.password)
			return next(Boom.badData("Register informations are missing or are not valid"));

		bcrypt.hash(newUser.password, env.SALT_ROUNDS, (err, hash) => {
			if (err)
				return next(err);

			newUser.password = hash;
			pool.query("INSERT INTO users SET ?", newUser, (err, data) => {
				if (err)
					return next(err);
				res.sendStatus(200);
			})
		})
	},

	setUser: (req, res, next) => {
		req.user = null;

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
		next();
	},

	requireUser: (req, res, next) => {
		if (!req.user)
			return next(Boom.forbidden("Must be logged to access this"));
		next();
	}
}
