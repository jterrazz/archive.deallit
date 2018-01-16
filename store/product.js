const	pool =		require('../store'),
		Boom =		require('boom'),
		analyse =	require('../plugins/analyse'),
		validator =	require('validator'),
		checker =	require('../plugins/checker')

const product = {
	getMany: (filters) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM products ";

			if (filters.userId)
				query += `WHERE creator_id=${ pool.escape(filters.userId) } `

			if (filters.quantity && validator.isNumeric(filters.quantity))
				query += `LIMIT ${ filters.quantity } `
			else
				query += "LIMIT 5 "
			if (filters.page && validator.isNumeric(filters.page))
				query+= `, ${ filters.page } `

			pool.query(query, (err, data) => {
				if (err)
					return reject(err)
				analyse.images(data)
				resolve(data)
			})
		})
	},
	getInfos: (productId) => {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM products WHERE product_id= ?", [productId], (err, data) => {
				if (err)
					return reject(err)
				else if (!data.length)
					return reject(Boom.resourceGone('Product not found in database'))

				analyse.images(data)
				resolve(data[0])
			})
		})
	},

	add: (product, userId) => {
		return new Promise((resolve, reject) => {
			var cleanProduct = checker.product(product)

			if (!cleanProduct)
				return reject(Boom.badData())
			cleanProduct.creator_id = userId
			pool.query("INSERT INTO products SET ?", [cleanProduct], (err, ret) => {
				if (err)
					return reject(err)
				else if (!ret.insertId)
					return reject(Boom.serverUnavailable('Coulnt insert new product'))
				return resolve(ret.insertId)
			})
		})
	},

	patch: (product, userId) => {
		return new Promise((resolve, reject) => {
			var cleanProduct = checker.product(product)

			if (!cleanProduct)
				return reject(Boom.badData())
			//Check product user
			//TODO Finish this
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
			pool.query("SELECT * FROM products ORDER BY product_id DESC LIMIT 5", (err, data) => {
				if (err)
					return reject(Boom.serverUnavailable("Couldn't get last products"))

				analyse.images(data)
				resolve(data)
			})
		})
	}
}

module.exports = product
