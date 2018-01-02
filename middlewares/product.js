const pool =		require('../store/mysql')

const product = {
	getInfos: (req, res, next) => {
		pool.query("SELECT * FROM products WHERE product_id=" + req.params.productId, (err, data) => {
			if (err || !data.length)
				return res.sendStatus(500)
			req.product = data[0]
			next()
		})
	},

	getRatings: (req, res, next) => {
		req.productRatings = {'dddd': 'dd'}
		next()
	},
}

module.exports = product
