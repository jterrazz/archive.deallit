const	Boom =			require('boom'),
		env =			require('../config/env'),
		router =		require('express').Router(),
		auth =			require('../middlewares/auth'),
		upload =		require('../middlewares/upload'),
		asyncHandler =	require('../middlewares/async'),
		dbUser =		require('../store/user'),
		dbMarket =		require('../store/market'),
		dbProduct =		require('../store/product'),
		tasks =			require('../plugins/tasks'),
		checker =		require('../plugins/checker'),
		bitcoin =		require('../plugins/bitcoin'),
		cacheDB =		require('../plugins/caching'),
		storageServer = require('../plugins/storage-server');

const	speakeasy =		require('speakeasy');

// TODO:240 require user and check user equal change

// TODO Parse all inputs

/**
 * #Important:0 Remove and create wallet when needed
 */

router.post("/createWallets", (req, res) => {
	const env = require('../config/env');


	res.end();
})

router.get('/wallet/:currency', auth.requireUser, asyncHandler(async (req, res, next) => {
	var currency = req.params.currency;

	if (['BTC', 'ETH'].indexOf(currency) < 0)
		return next(Boom.badData("Wallet currency is invalid"));
	if (currency == 'BTC')
		var type = env.devMode ? 'tBTC' : 'BTC';
	else if (currency == 'ETH')
		var type = env.devMode ? 'tETH' : 'ETH';

	var data = await dbUser.getWalletForUser(req.user.userId, type, false);
	if (data)
		return res.json(data);

	switch (currency) {
		case 'BTC':
			var wif = bitcoin.createRandomWIF();
			var publicAddress = bitcoin.getLegacyAddress(wif);

			await dbUser.saveWallet(type, 5, publicAddress, wif, false);
			break;
		case 'ETH':
			return next("ETH not supported yet");
	}
	res.json({ publicAddress: publicAddress });
}))

/**
 * File uploads
 */

router.post('/upload/image', auth.requireUser, upload.handleImage, (req, res) => {
	res.json({
		filename: req.file.filename,
	});
})

/**
 * Authentication
 */

router.post('/auth/login', auth.login);

router.post('/auth/register', auth.register);

router.post('/auth/login-two-fa', auth.confirmTwoFA);

router.get('/auth/2fa', auth.requireUser, (req, res, next) => {
	var secret = speakeasy.generateSecret();
	var base32secret = secret.base32;
	var qrData = secret.otpauth_url;

	cacheDB.set(`user-${ req.user.userId }:twoFA-secret`, base32secret, 'EX', env.TWO_FA_REGISTER_TIME, (err, ret) => {
		if (err)
			return next(err);
		res.json({ secret: qrData });
	});
})

router.post('/auth/2fa', auth.requireUser, (req, res, next) => {
	cacheDB.get(`user-${ req.user.userId }:twoFA-secret`, async (err, base32secret) => {
		if (err)
			return next(err);
		else if (!base32secret)
			return next(Boom.resourceGone("Could not find 2FA data on server, please restart the process"));

		var verified = speakeasy.totp.verify({
			secret: base32secret,
			encoding: 'base32',
			token: req.body.confirmation,
		});

		if (!verified)
			return next(Boom.unauthorized("Bad confirmation code"));
		await dbUser.saveTwoFA(req.user.userId, base32secret);

		res.sendStatus(200);
	});
})

/**
 * User status/informations
 */

router.route('/me')
	.get(auth.requireUser, asyncHandler(async (req, res) => {
		var user = await dbUser.get(req.user.userId);

		res.json(user);
	}))

	.patch(auth.requireUser, asyncHandler(async (req, res) => {
		var safeUser = checker.rawUser(req.body);

		//TODO Check password included with password change and mail // AND CHECK IS NOT THE SAME
		// if (safeUser.mail)
		// check mail is included
		if (safeUser.userImage)
			await storageServer.sendFiles([safeUser.userImage]);
		await dbUser.patch(req.user.userId, safeUser);
		res.sendStatus(200);
	}))

	//#Important:10 Delete user but also his products and images ?
	.delete(auth.requireUser, asyncHandler(async (req, res) => {
		await dbUser.delete(req.user.userId);

		res.sendStatus(200);
	}))

// TODO:190 Query 2 times user in start ? (/me and /status)
router.get('/status', auth.requireUser, asyncHandler(async (req, res) => {
	var userStatus = {};
	var user = await dbUser.get(req.user.userId);

	userStatus.nb_messages = await dbUser.getNbMessages(req.user.userId, user.seen_messages_id);
	userStatus.nb_notifications = await dbUser.getNbNotifications(req.user.userId, user.seen_notifications_id);

	res.json(userStatus);
}))

// TODO Do pagination for many conversations + redo conversations for products and not user
router.get('/conversations', auth.requireUser, asyncHandler(async (req, res) => {
	var conversations = await dbUser.getConversations(req.user.userId);

	res.json(conversations);
}))

router.get('/notifications', auth.requireUser, asyncHandler(async (req, res) => {
	var notifications = await dbUser.getNotifications(req.user.userId);

	res.json(notifications);
}))

router.get('/user/:userId', asyncHandler(async (req, res) => {
	var user = await dbUser.get(req.params.userId);

	res.json(user);
}))

/**
 * User operations
 */

router.route('/orders')
	.get(auth.requireUser, asyncHandler(async (req, res) => {
		var orders = await dbUser.getOrders(req.user.userId);

		res.json(orders)
	}))

	//TODO:210 Update product quantity and eventually not make offer appearing
	.post(auth.requireUser, asyncHandler(async (req, res) => {
		var safeOrder = checker.rawOrder(req.body);

		safeOrder.userId = req.user.userId;
		await dbUser.insertOrder(safeOrder);

		res.sendStatus(200);
	}))

router.route('/order/:orderId')
	.get(auth.requireUser, asyncHandler(async (req, res) => {
		var order = await dbUser.getOrder(req.params.orderId);

		res.json(order);
	}))

	.delete(auth.requireUser, asyncHandler(async (req, res) => {
		//TODO:50 Check is possible and userid ok
		await dbUser.cancelOrder(req.user.userId, req.params.orderId)

		res.sendStatus(200)
	}))

// TODO Messages to ID or to Product ? Or mix of both
router.route('/messages/:contactId')
	.get(auth.requireUser, asyncHandler(async (req, res) => {
		var messages = await dbUser.getMessages(req.user.userId, req.params.contactId)

		res.json(messages)
	}))

	.post(auth.requireUser, asyncHandler(async (req, res, next) => {
		if (req.user.userId == req.params.contactId)
			return next(Boom.badData("You can't send a message to yourself"));

		var message = req.body.message;
		// TODO Sanatize message for SQL and User
		await dbUser.postMessage(req.user.userId, req.params.contactId, message);

		res.sendStatus(200);
	}))

/**
 * Product(s)
 */

router.get('/s/:searched', asyncHandler(async (req, res) => {
	var products = await dbProduct.getMany({
		search: req.params.searched
	});

	res.json(products);
}))

/* product routes */
router.get('/products', asyncHandler(async (req, res) => {
	var products = await dbProduct.getMany(req.query);

	res.json(products);
}))

router.route('/product')
	.post(auth.requireUser, asyncHandler(async (req, res) => {
		var safeProduct = checker.rawProduct(req.body);

		if (!safeProduct)
			return next(Boom.badData("Product data do not conform the rules"));

		safeProduct.creator_id = req.user.userId;
		var imagesUploaded = await storageServer.sendFiles(safeProduct.images);

		safeProduct.images = JSON.stringify(imagesUploaded);
		var productId = await dbProduct.add(safeProduct);

		res.json({
			product_id: productId
		});
	}))

	// TODO:20 Change route and user productId in url
	.patch(auth.requireUser, asyncHandler(async (req, res, next) => {
		var safeProduct = checker.rawProduct(req.body);
		if (!safeProduct)
			return next(Boom.badData("Bad product data"));

		delete safeProduct.images; // TODO Change also images
		await dbProduct.patch(req.user.userId, req.body.productId, safeProduct);

		res.sendStatus(200);
	}))

router.route('/product/:productId')
	.get(asyncHandler(async (req, res) => {
		var product = await dbProduct.get(req.params.productId);

		res.json(product);
	}))
	.delete(auth.requireUser, asyncHandler(async (req, res) => {
		await dbProduct.delete(req.user.userId, req.params.productId);

		res.sendStatus(200);
	}))

router.get('/product/:productId/ratings', asyncHandler(async (req, res) => {
	var ratings = await dbProduct.getRatings(req.params.productId);

	res.json(ratings);
}))

router.patch('/product/:productId/tags', auth.requireUser, asyncHandler(async (req, res) => {
	// TODO Check productId is user
	await dbProduct.updateTags(req.params.productId, req.body);

	res.sendStatus(200);
}))

/**
 * Market
 */

router.route('/market')
	.patch(auth.requireUser, asyncHandler(async (req, res, next) => {
		var safeMarket = checker.rawMarket(req.body);

		if (Object.keys(safeMarket).length === 0)
			return next(Boom.badData("Incomplete market informations for an update"));

		await storageServer.sendFiles([safeMarket.marketBackground]);
		await dbMarket.patch(req.user.userId, safeMarket);

		res.sendStatus(200);
	}))

router.route('/market/:identifier')
	.get(asyncHandler(async (req, res) => {
		var market = await dbMarket.get('identifier', req.params.identifier);

		if (req.query.tags)
			market.tags = await dbMarket.getTags(market.user_id);
		res.json(market);
	}))

router.get('/user/:userId/market', asyncHandler(async (req, res) => {
	var market = await dbMarket.get('userId', req.params.userId);

	if (req.query.tags)
		market.tags = await dbMarket.getTags(market.user_id);
	res.json(market);
}));

module.exports = router;
