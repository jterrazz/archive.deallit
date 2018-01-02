const	router =	require('express').Router(),
		user =		require('../middlewares/user'),
		auth =		require('../middlewares/auth'),
		product =		require('../middlewares/product')

/* Auth */
router.post('/auth/login', auth.login)
router.post('/auth/register', auth.register)

/* User */
router.get('/me', (req, res) => {})
router.get('/user/:userId', user.getInfos, (req, res) => {
	res.json(req.userSearched)
})

/* Product */
router.get('/product/:productId', product.getInfos, (req, res) => {
	res.json(req.product)
})
router.get('/product/:productId/ratings', product.getRatings, (req, res) => {
	res.json(req.productRatings)
})
router.post('/product', auth.requireUser, (req, res) => {})

module.exports = router;
