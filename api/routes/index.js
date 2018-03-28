const	express =	require('express'),
		router =	express.Router(),
		env =		require('../config/env'),
		logger =	require('../libs/logger'),
		auth =		require('../middlewares/auth');

module.exports = function(app) {
	require('./sockets');
	if (env.webhookOn)
		require('./webhook');

	app.use(auth.setUser);
	app.use('/api', require('./api'));

	/**
	 *  Error handler
	 */

	app.use((err, req, res, next) => {
		logger.error(err);
		if (err instanceof Error && err.isBoom) {
			res.status(err.output.statusCode).json(err.output.payload);
		} else {
			res.sendStatus(400);
		}
	})
}
