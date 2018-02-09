const	pool =		require('../store'),
		Boom =		require('boom'),
		analyse =	require('../plugins/analyse'),
		validator =	require('validator'),
		checker =	require('../plugins/checker'),
		upload =	require('../plugins/upload');

const product = {
	getMany: (filters) => {
		return new Promise((resolve, reject) => {
			var whereInit = 0;
			var query = "SELECT p.* "
			if (filters.tags)
				query += ", GROUP_CONCAT(pt.tag) AS tags "
			if (filters.search)
				query += `, MATCH (p.name) AGAINST (${ pool.escape(filters.search) }) as score `

			query += "FROM products p ";

			if (filters.tags)
				query += 'LEFT JOIN product_tags pt ON pt.product_id=p.product_id '
			if (filters.tag)
				query += 'LEFT JOIN product_tags pt2 ON pt2.product_id=p.product_id '
			if (filters.categorie)
				query += 'LEFT JOIN categories c ON c.categorie_id=p.categorie_id '
			if (filters.identifier)
				query += 'LEFT JOIN users u ON u.user_id=p.creator_id '

			if (filters.userId)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } p.creator_id=${ pool.escape(filters.userId) } `
			if (filters.identifier)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } u.market_identifier=${ pool.escape(filters.identifier) } `
			if (filters.tag)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } pt2.tag = ${ pool.escape(filters.tag) } `
			if (filters.categorie)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } c.categorie_path = ${ pool.escape(filters.categorie) } `
			if (filters.priceMin)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } p.price >= ${ pool.escape(filters.priceMin) } `
			if (filters.priceMax)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } p.price <= ${ pool.escape(filters.priceMax) } `
			if (filters.search)
				query += `${ whereInit++ ? 'AND' : 'WHERE' } MATCH (p.name) AGAINST (${ pool.escape(filters.search) }) > 0 `

			if (filters.tags)
				query += 'GROUP BY p.product_id '

			query += "ORDER BY p.product_id DESC "

			if (filters.limit && validator.isNumeric(filters.limit))
				query += `LIMIT ${ filters.limit } `
			else
				query += "LIMIT 5 "
			if (filters.page && validator.isNumeric(filters.page))
				query+= `, ${ filters.page } `

			pool.query(query, (err, data) => {
				if (err)
					return reject(err)
				resolve(data)
			})
		})
	},

	get: (productId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT p.*, c.*, u.first_name, u.last_name, u.user_image FROM products p " +
				"LEFT JOIN categories c ON c.categorie_id=p.categorie_id " +
				"LEFT JOIN users u ON u.user_id = p.creator_id WHERE p.product_id= ?"

			pool.query(query, [productId], (err, data) => {
				if (err)
					return reject(err)
				else if (!data.length)
					return reject(Boom.resourceGone('Product not found in database'))

				analyse.images(data)
				resolve(data[0])
			})
		})
	},

	add: (cleanProduct) => {
		return new Promise((resolve, reject) => {
			pool.query("INSERT INTO products SET ?", [cleanProduct], (err, ret) => {
				if (err)
					return reject(err)
				else if (!ret.insertId)
					return reject(Boom.serverUnavailable('Couldnt insert new product'))
				return resolve(ret.insertId)
			})
		})
	},

	patch: (product, userId, productId) => {
		return new Promise((resolve, reject) => {
			var query = "UPDATE products SET ? WHERE creator_id=? AND product_id=?";

			pool.query(query, [product, userId, productId], (err, data) => {
				if (err)
					return reject(err);
				return resolve();
			})
		})
	},

	// TODO REMOVE ALSO THE TAGS !!!!!!!!!!!!
	delete: (userId, productId) => {
		return new Promise((resolve, reject) => {
			pool.query("DELETE FROM products WHERE product_id=? AND creator_id=?", [productId, userId], (err, data) => {
				if (err)
					return reject(err)
				else if (!data.affectedRows)
					return reject(Boom.badData("No product to delete found in database"))
				resolve()
			})
		})
	},

	// TODO Do better than that lol
	updateTags: (productId, body) => {
		return new Promise((resolve, reject) => {
			var tags = body.tags,
			queryTags = [];

			tags.forEach((tag) => {
				queryTags.push([productId, tag])
			})
			pool.query("DELETE FROM product_tags WHERE product_id= ?", [productId], (err, data) => {
				if (err)
					return reject(err)
				else if (!queryTags.length)
					return resolve()
				pool.query("INSERT INTO product_tags (product_id, tag) VALUES ?", [queryTags], (err, data) => {
					if (err)
						return reject(err)
					return resolve()
				})
			})
		});
	},

	getRatings: (productId) => {
		return new Promise((resolve, reject) => {
			var productRatings = {'dddd': 'dd'}

			resolve(productRatings)
		})
	},
}

module.exports = product
