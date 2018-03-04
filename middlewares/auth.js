const	Boom =			require('boom'),
		fs =			require('fs'),
		jwt =			require('jsonwebtoken'),
		bcrypt =		require('bcrypt'),
		validator = 	require('validator'),
		speakeasy =		require('speakeasy'),
		env =			require('../config/env'),
		pool = 			require('../store').pool,
		dbUser =		require('../store/user'),
		asyncHandler =	require('./async');

const	cert =			fs.readFileSync('config/jwt.key');

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

	confirmTwoFA: asyncHandler(async (req, res, next) => {
		var decoded = await decodeAuthorization(req.headers.authorization);
		var tempCode = req.body.code;

		if (!decoded.stillNeedToTwoFA)
			return next(Boom.unauthorized("This token doesnt need 2ID check"));

		var secret = await dbUser.getTwoFA(decoded.userId);
		var verified = speakeasy.totp.verify({
			secret: secret,
			encoding: 'base32',
			token: tempCode,
		});
		if (!verified)
			return next(Boom.unauthorized("Bad verification code"));

		var payload = {
			exp: Math.floor(Date.now() / 1000) + env.JWT_TOKEN_DURATION,
			userId: decoded.userId,
		};

		jwt.sign(payload, cert, { algorithm: 'HS512' }, (err, token) => {
			if (err)
				return next(err);
			return res.json({ token });
		})
	}),

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

	setUser: asyncHandler(async (req, res, next) => {
		req.user = null;

		if (!req.headers.authorization)
			return next();
		var decoded = await decodeAuthorization(req.headers.authorization);
		if (decoded && !decoded.stillNeedToTwoFA)
			req.user = decoded;

		return next();
	}),

	requireUser: asyncHandler(async (req, res, next) => {
		if (!req.user && !req.user.userId)
			return next(Boom.forbidden("Must be logged to access this"));

		return next();
	})
}

function decodeAuthorization(token, callback) {
	return new Promise(function(resolve, reject) {
		if (!token)
			return reject(Error("No token provided"));

		var parts = token.split(' ');
		if (parts.length != 2)
			return reject(Error("Bad token format"));

		var scheme = parts[0],
			credentials = parts[1];
		if (!(/^Bearer$/i.test(scheme)))
			return reject(Error("Bad token scheme"));
		jwt.verify(credentials, cert, (err, decoded) => {
			if (err)
				return reject(err);
			return resolve(decoded);
		})
	});
}
