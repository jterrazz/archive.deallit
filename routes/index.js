const	router =			require('express').Router(),
		Boom =				require('boom'),
		asyncHandler =		require('../middlewares/async'),
		auth =				require('../middlewares/auth'),
		upload =			require('../middlewares/upload'),
		dbUser =			require('../store/user'),
		dbProduct =			require('../store/product'),
		dbMarket =			require('../store/market'),
		uploadPlugin =		require('../plugins/upload')

/* Auth */
router.post('/auth/login', auth.login)
router.post('/auth/register', auth.register)

/* Uploads */ //require user TODO
router.post('/upload/image', upload.handleImage, (req, res) => {
	res.json({
		filename: req.file.filename,
	});
})

// TEMP
router.post('/confirm', asyncHandler(async (req, res) => {
	await uploadPlugin.storeFiles(['f4bf6a4ec7f1e8b7602e964096f86850s'])
	res.end()
}))

router.route('/product')
 	.post(auth.requireUser, asyncHandler(async (req, res) => {
		var productId = await dbProduct.add(req.body, req.user.user_id)
		res.json({
			product_id: productId
		})
	}))
	.patch(auth.requireUser, asyncHandler(async (req, res) => {
		await dbProduct.patch(req.body, req.user.user_id)
		res.sendStatus(200)
	}))

router.get('/products', asyncHandler(async (req, res) => {
	var products = await dbProduct.getMany(req.query)

	res.json(products)
}))

/* User */
router.get('/me', (req, res) => {})

router.get('/user/:userId', asyncHandler(async (req, res) => {
	var user = await dbUser.getInfos(req.params.userId)

	res.json(user)
}))

router.get('/user/:userId/market', asyncHandler(async (req, res) => {
	var market = await dbMarket.getInfos(req.params.userId)

	res.json(market)
}))

//TODO Change to generic function
router.get('/user/:userId/market/products', asyncHandler(async (req, res) => {
	var products = await dbMarket.getLastProducts(req.params.userId)

	res.json(products)
}))

/* Product */
router.get('/product/:productId', asyncHandler(async (req, res) => {
	var product = await dbProduct.getInfos(req.params.productId)

	res.json(product)
}))

router.get('/product/:productId/ratings', asyncHandler(async (req, res) => {
	var ratings = await dbProduct.getRatings(42);

	res.json(ratings)
}))

//TODO Change to generic function
router.get('/products/recents', asyncHandler(async (req, res) => {
	var products = await dbProduct.getLastItems()

	res.json(products)
}))

router.post('/settings/identity', auth.requireUser, asyncHandler(async (req, res) => {
	var informations = {
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		gender: req.body.gender,
	}

	await dbUser.updateInformations(req.user, informations)
	res.sendStatus(200)
}))

/* Error handler */
router.use((err, req, res, next) => {
	console.log(err);
	if (err.isBoom) {
		res.status(err.output.statusCode).json(err.output.payload)
	} else {
		res.end()
	}
})

module.exports = router;
