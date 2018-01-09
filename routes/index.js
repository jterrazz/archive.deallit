const	router =			require('express').Router(),
		Boom =				require('boom'),
		asyncHandler =		require('../middlewares/async'),
		auth =				require('../middlewares/auth'),
		dbProduct =			require('../store/product')
		dbUser =			require('../store/user'),

/* Auth */
router.post('/auth/login', auth.login)
router.post('/auth/register', auth.register)

/* User */
router.get('/me', (req, res) => {})

router.get('/user/:userId', asyncHandler(async (req, res) => {
	var user = await dbUser.getInfos(req.params.userId)

	res.json(user)
}))

/* Product */
router.get('/product/:productId', asyncHandler(async (req, res, next) => {
	var product = await dbProduct.getInfos(req.params.productId)

	res.json(product)
}))

router.get('/product/:productId/ratings', asyncHandler(async (req, res, next) => {
	var ratings = await dbProduct.getRatings(42);

	res.json(ratings)
}))

router.post('/product', auth.requireUser, (req, res) => {})

router.get('/products/recents', asyncHandler(async (req, res) => {
	var products = await dbProduct.getLastItems()

	res.json(products)
}))

router.post('/settings/identity', auth.requireUser, asyncHandler(async (req, res, next) => {
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
	}
})

module.exports = router;
