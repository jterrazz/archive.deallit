const	Boom =			require('boom'),
		fs =			require('fs'),
		jwt =			require('jsonwebtoken'),
		bcrypt =		require('bcryptjs'),
		validator = 	require('validator'),
		speakeasy =		require('speakeasy'),
		env =			require('../config/env'),
		pool = 			require('../models').pool,
		poolPromise = 	require('../models').poolPromise,
		dbUser =		require('../models/user'),
		dbNotification =		require('../models/Notification'),
		mail =			require('../libs/mail'),
		randomstring =	require('randomstring'),
		asyncHandler =	require('./async');

const	cert =			fs.readFileSync('config/jwt.key');

var createToken = function(userId, needTwoFA, needMailConfirmation) {
	return new Promise(function(resolve, reject) {
		var payload = {
			exp: Math.floor(Date.now() / 1000) + env.JWT_TOKEN_DURATION,
			userId: userId,
			stillNeedToTwoFA: !!needTwoFA,
			needMailConfirmation: !!needMailConfirmation,
			v: 0
		};

		jwt.sign(payload, cert, { algorithm: 'HS512' }, (err, token) => {
			if (err)
				return reject(err);
			return resolve([token, payload.exp]);
		})
	});
}

var decodeAuthorization = function(token, callback) {
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

module.exports = {
	login: asyncHandler(async (req, res, next) => {
		const userData = {
			mail: req.body.mail,
			password: req.body.password
		};
		if (req.user || !userData.mail || !validator.isEmail(userData.mail) || !userData.password)
			return next(Boom.badData("Login data incomplete"));

		var [userSql] = await poolPromise.query("SELECT * FROM users WHERE mail = ?", userData.mail);
		if (!userSql.length)
			return next(Boom.notFound("This mail is not registred"));

		var user = userSql[0];
		var isValid = await bcrypt.compare(userData.password, user.password);
		if (!isValid)
			return next(Boom.unauthorized("Password incorrect"));
		var [token, exp] = await createToken(user.user_id, user.two_fa_secret, user.waiting_confirmation);
		res.json({ token, needTwoFA: !!user.two_fa_secret, exp });
	}),

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

		var [token, exp] = await createToken(decoded.userId, false);
		res.json({ token, exp });
	}),

	register: asyncHandler(async (req, res, next) => {
		const user = req.body;
		const newUser = {
			mail: user.mail,
			password: user.password,
			// TODO Create the mail verification

			// waiting_confirmation: randomstring.generate({
			// 	length: 256,
			// }),
		}

		// TODO check mail validity, password
		if (req.user || !user || !user.mail || !validator.isEmail(user.mail) || !user.password)
			return next(Boom.badData("Register informations are missing or are not valid"));

		var hash = await bcrypt.hash(newUser.password, env.SALT_ROUNDS)
		newUser.password = hash;
		try {
			var [data] = await poolPromise.query("INSERT INTO users SET ?", newUser);
			mail.sendRegistration("jterrazzoni@gmail.com", newUser.waiting_confirmation);
			await dbNotification.welcomeUser(data.insertId);
			res.sendStatus(200);
		} catch (err) {
			if (err.errno == 1062)
				next(Boom.conflict("Duplicate key: mail already registred"));
			throw err;
		}
	}),

	setUser: asyncHandler(async (req, res, next) => {
		req.user = null;

		if (!req.headers.authorization)
			return next();
		var decoded = await decodeAuthorization(req.headers.authorization);
		if (decoded && !decoded.stillNeedToTwoFA && !decoded.needMailConfirmation)
			req.user = decoded;
		else
			req.tempUser = decoded;

		return next();
	}),

	requireUser: asyncHandler((req, res, next) => {
		if (!req.user || !req.user.userId)
			return next(Boom.forbidden("Must be logged to access this"));

		return next();
	})
}
