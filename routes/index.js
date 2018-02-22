const	router =	require('express').Router(),
		auth =		require('../middlewares/auth');

module.exports = function(app) {
	app.use(auth.setUser);
	app.use('/api/v0', require('./api'));
	app.use('/events/v0', require('./events'));
	require('./sockets');

	/* error handler */
	app.use((err, req, res, next) => {
		if (err.isBoom) {
			res.status(err.output.statusCode).json(err.output.payload);
		} else {
			console.log(err);
			res.sendStatus(400);
		}
	})
}
