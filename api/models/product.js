const	Boom =			require('boom'),
		pool =			require('./index').pool,
		poolPromise =			require('./index').poolPromise,
		analyzer =		require('../libs/analyzer'),
		validator =		require('validator'),
		snakeCaseKeys = require('snakecase-keys');

const product = {
	// TODO Better algorythm
	getWall: async (userId) => {
		var wall = [];
		var [data] = await poolPromise.query("SELECT p.*, u.* FROM products p LEFT JOIN users u ON u.user_id=p.creator_id LEFT JOIN follows f ON p.creator_id=f.followed_id WHERE f.user_id = ?", [userId]);
		for (var i = 0; i < data.length; i++) {
			var index = -1;
			wall.forEach((d, j) => {
				if (d[0].user_id == data[i].user_id)
					index = j
			})
			if (index == -1)
				wall.push([data[i]]);
			else
				wall[index].push(data[i]);
		}
		wall.forEach(d => {
			analyzer.decodeImagesURL(d);
			analyzer.decodeTags(d);
		})
		return wall;
	},

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
				query += `${ whereInit++ ? 'AND' : 'WHERE' } c.id = ${ pool.escape(filters.categorie) } `
			// if (filters.priceMin)
			// 	query += `${ whereInit++ ? 'AND' : 'WHERE' } p.price >= ${ pool.escape(filters.priceMin) } `
			// if (filters.priceMax)
			// 	query += `${ whereInit++ ? 'AND' : 'WHERE' } p.price <= ${ pool.escape(filters.priceMax) } `
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

			pool.query(query, async (err, products) => {
				if (err)
					return reject(err);

				analyzer.decodeImagesURL(products);
				analyzer.decodeTags(products);
				try {
					await analyzer.setPrices(products);
					return resolve(products);
				} catch (err) {
					return reject(err);
				}
			})
		})
	},

	get: (productId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT p.*, c.*, c.id AS categorie_id, u.first_name, u.last_name, u.user_image FROM products p " +
				"LEFT JOIN categories c ON c.categorie_id=p.categorie_id " +
				"LEFT JOIN users u ON u.user_id = p.creator_id WHERE p.product_id= ?";

			pool.query(query, [productId], async (err, data) => {
				if (err)
					return reject(err);
				else if (!data.length)
					return reject(Boom.resourceGone('Product not found in database'));

				analyzer.decodeImagesURL([data[0]]);
				try {
					await analyzer.setPrices([data[0]]);
					return resolve(data[0]);
				} catch (e) {
					return reject(e);
				}
			})
		})
	},

	add: (product) => {
		return new Promise((resolve, reject) => {
			pool.query("INSERT INTO products SET ?", [snakeCaseKeys(product)], (err, ret) => {
				if (err)
					return reject(err);
				else if (!ret.insertId)
					return reject(Boom.serverUnavailable('Couldnt insert new product'));
				return resolve(ret.insertId);
			})
		})
	},

	patch: (userId, productId, product) => {
		return new Promise((resolve, reject) => {
			var query = "UPDATE products SET ? WHERE creator_id = ? AND product_id = ?";

			pool.query(query, [snakeCaseKeys(product), userId, productId], (err, ret) => {
				if (err)
					return reject(err);
				else if (!ret.affectedRows)
					return reject(Boom.notFound("No product found"));
				return resolve();
			})
		})
	},

	// TODO:200 REMOVE ALSO THE TAGS !!!!!!!!!!!!
	// TODO:60 DELETE ALL PHOTOS FROM S3
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

	// TODO:150 Do better than that lol
	updateTags: (productId, body) => {
		return new Promise((resolve, reject) => {
			var tags = body.tags,
			queryTags = [];

			if (!tags || !Array.isArray(tags))
				return reject(Boom.badData("No tags provided"));

			tags.forEach((tag) => {
				queryTags.push([productId, tag]);
			});
			pool.query("DELETE FROM product_tags WHERE product_id= ?", [productId], (err, data) => {
				if (err)
					return reject(err);
				else if (!queryTags.length)
					return resolve();
				pool.query("INSERT INTO product_tags (product_id, tag) VALUES ?", [queryTags], (err, data) => {
					if (err)
						return reject(err);
					return resolve();
				})
			})
		});
	},

	getRatings: (productId) => {
		return new Promise((resolve, reject) => {
			var query = "SELECT * FROM product_ratings WHERE product_id = ?";

			pool.query(query, [productId], (err, ratings) => {
				if (err)
					return reject(err);
				resolve(ratings);
			})
		})
	},
}

module.exports = product
