const	pool =		require('../store'),
		Boom =		require('boom')

const product = {
	getInfos: (productId) => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM products WHERE product_id= ?", [productId], (err, data) => {
				if (err)
					return reject(Boom.serverUnavailable('Tried getting infos for a product_id'))
				else if (!data.length)
					return reject(Boom.resourceGone('Product not found in database'))

				return resolve(data[0])
			})
		})
	},

	getRatings: (productId) => {
		return new Promise((resolve, reject) => {
			var productRatings = {'dddd': 'dd'}

			resolve(productRatings)
		})
	},

	getLastItems: () => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM products ORDER BY product_id DESC LIMIT 10", (err, data) => {
				if (err)
					return reject(Boom.serverUnavailable("Couldn't get last products"))

				resolve(data)
			})
		})
	}
}

module.exports = product
