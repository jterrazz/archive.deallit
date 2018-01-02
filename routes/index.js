const	router =	require('express').Router(),
		user =		require('../middlewares/user')

router.get('/user/:userId', user.getInfos, (req, res) => {
	res.json(req.userSearched)
})

module.exports = router;
