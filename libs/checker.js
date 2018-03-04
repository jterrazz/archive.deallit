const	Boom =			require('Boom'),
		validator =		require('validator'),
		pool =			require('../store').pool;

var categories = null;

function getCategories(callback) {
	if (categories)
		return callback(null, categories);
	pool.query("SELECT * FROM categories", (err, data) => { // TODO Try more times
		if (err)
			return callback(err);
		categories = data;
		return callback(null, categories);
	})
}

function checkKeys(keys, raw){
	var safe = {};
	var err = false;

	if (!raw)
		return null;

	keys.forEach(key => {
		if ((raw[key.key] && !key.ft) || (raw[key.key] && key.ft && key.ft(raw[key.key])))
			safe[key.newKey ? key.newKey : key.key] = key.ftData ? key.ft(raw[key.key]) : raw[key.key];
	 	if (key.required && !safe[key.newKey ? key.newKey : key.key])
			return (err = true);
	})

	return err ? null : safe;
}
//TODO:100 Handle error returns

//TODO: Check required or not
module.exports = {
	rawProduct: (rawProduct) => {
		return new Promise(function(resolve, reject) {
			getCategories((err, categoriesArray) => {
				if (err)
					return reject(err);

				const keys = [{
						key: 'name',
						required: true,
						ft: function(el) { return validator.isAscii(el); }
					},
					{
						key: 'description',
						ft: function(el) { return validator.isAscii(el); }
					},
					{
						key: 'categorie',
						newKey: 'categorie_id',
						required: true,
						ftData: true,
						ft: function(el) {
							var found = false;
							categoriesArray.forEach(cat => {
								if (cat.id == el)
									found = cat.categorie_id;
							})
							return found;
						},
					},
				];

				var safeProduct = checkKeys(keys, rawProduct);
				if (!safeProduct)
					return reject(Boom.badData("Data provided doesnt conform the rules"));

				if (rawProduct.price)
					rawProduct.price = Number(rawProduct.price); // TODO Check is safe
				if (rawProduct.currency == 'EUR' && Number.isInteger(rawProduct.price))
					safeProduct.price_EUR = rawProduct.price;
				else if (rawProduct.currency == 'USD' && Number.isInteger(rawProduct.price))
					safeProduct.price_USD = rawProduct.price;
				else
					return reject(Boom.badData("Data provided doesnt conform the rules"));

				if (rawProduct.images instanceof Array && rawProduct.images.length) {
					safeProduct.images = [];

					rawProduct.images.forEach(image => { // Check is origin of image
						if (validator.isAlphanumeric(image))
							safeProduct.images.push(image);
					})
				}

				return resolve(safeProduct);
			})
		});
	},

	rawUser: (rawUser) => {
		const keys = ['firstName', 'lastName', 'gender', 'userImage', 'currency', 'mail'];
		var safeUser = {};

		keys.forEach(key => {
			if (rawUser[key])
				safeUser[key] = rawUser[key];
		});

		return safeUser;
	},

	rawMarket: (rawMarket) => {
		const keys = [
			{ key: 'marketBackground' },
			{
				key: 'marketBackground',
				ft: function(el) { return validator.isAlpha(el); }
			},
		]

		return checkKeys(keys, rawMarket);
	},

	rawOrder: (rawOrder) => {
		const keys = [
			{ key: 'productId' },
			{ key: 'delivery' },
			{ key: 'payment', newKey: "prefered_payment" },
			{ key: 'address' },
		]

		return checkKeys(keys, rawOrder);
	}
}
