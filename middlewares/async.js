const asyncMiddleware = (middleware) => {
	return async (req, res, next) => {
		try {
			await middleware(req, res, next)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = asyncMiddleware
