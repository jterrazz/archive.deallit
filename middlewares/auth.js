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
		const userData = {
			mail: req.body.mail,
			password: req.body.password
		};

		if (req.user || !userData || !userData.mail || !validator.isEmail(userData.mail) || !userData.password)
			return next(Boom.badData("Login informations are missing or are not valid"));

		pool.query("SELECT * FROM users WHERE mail = ?", userData.mail, (err, userSql) => {
			if (err)
				return next(err);
			else if (!userSql.length)
				return next(Boom.notFound("This mail is not registred"));

			var user = userSql[0];
			bcrypt.compare(userData.password, user.password, (err, isValid) => {
				if (err)
					return next(err);
				else if (!isValid)
					return next(Boom.unauthorized("Password incorrect"));

				var payload = {
					exp: Math.floor(Date.now() / 1000) + env.JWT_TOKEN_DURATION,
					userId: user.user_id,
					stillNeedToTwoFA: !!user.two_fa_secret
				};

				jwt.sign(payload, cert, { algorithm: 'HS512' }, (err, token) => {
					if (err)
						return next(err);
					res.json({ token });
				})
			})
		})
	},

	confirmTwoFA: (req, res, next) => {
		var twoFACode = req.body.twoFACode;

		decodeAuthorization(req.headers.authorization)
			.then(decoded => {
				if (!decoded.stillNeedToTwoFA)
					return next(Boom.unauthorized("Bad token"));

				var payload = {
					exp: Math.floor(Date.now() / 1000) + env.JWT_TOKEN_DURATION,
					userId: decoded.userId,
				};

				jwt.sign(payload, cert, { algorithm: 'HS512' }, (err, token) => {
					if (err)
						return next(err);
					res.json({ token });
				})
				return next();
			})
			.catch(err => {
				console.log(err);
				return next(Boom.badGateway("Error in auth verification"));
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
		console.log('fffff');

		if (!req.headers.authorization)
			return next();
		decodeAuthorization(req.headers.authorization)
			.then(decoded => {
				if (decoded && !decoded.stillNeedToTwoFA)
					req.user = decoded;
					console.log(decoded);
				return next();
			})
			.catch(() => {
				return next(Boom.badGateway("Error in auth verification"));
			})
	},

	requireUser: (req, res, next) => {
		console.log('requireUser here');
		if (!req.user)
			return next(Boom.forbidden("Must be logged to access this"));
		next();
	}
}

function decodeAuthorization(token, callback) {
	return new Promise(function(resolve, reject) {
		if (!token)
			return reject();
		var parts = token.split(' ');

		if (parts.length == 2) {
			var scheme = parts[0],
				credentials = parts[1];

			if (/^Bearer$/i.test(scheme)) {
				jwt.verify(credentials, cert, (err, decoded) => {
					if (err)
						return reject(err);
					return resolve(decoded);
				})
			} else {
				return reject();
			}
		} else {
			return reject();
		}
	});
}
