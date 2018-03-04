const	router =	require('express').Router(),
		auth =		require('../middlewares/auth');

module.exports = function(app) {
	require('./sockets');
	require('./webhook');

	app.use(auth.setUser);
	app.use('/api/v0', require('./api'));

	/**
	 *  Error handler
	 */

	app.use((err, req, res, next) => {
		if (err instanceof Error && err.isBoom) {
			res.status(err.output.statusCode).json(err.output.payload);
		} else {
			console.log(err);
			res.sendStatus(400);
		}
	})
}
