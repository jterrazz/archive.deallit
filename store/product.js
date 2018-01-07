const	pool =		require('../store'),
		Boom =		require('boom')

const product = {
	getInfos: (productId) => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM products WHERE product_id=" + productId, (err, data) => {
				if (err)
					reject(Boom.serverUnavailable('Tried getting infos for a product_id'))
				else if (!data.length)
					reject(Boom.resourceGone('Product not found in database'))

				resolve(data[0])
			})
		})
	},

	getRatings: (productId) => {
		return new promise((resolve, reject) => {
			var productRatings = {'dddd': 'dd'}

			resolve(productRatings)
		})
	},
}

module.exports = product
