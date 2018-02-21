const validator = require('validator');

function checkKeys(keys, raw){
	var safe = {};

	if (!raw)
		return null;

	keys.forEach(key => {
		if (!raw[key.key] || (key.ft && !key.ft(raw[key.key])))
			return null;
		safe[key.key] = raw[key.key];
	})

	return safe;
}

//TODO:100 Handle error returns

//TODO: Check required or not
module.exports = {
	rawProduct: (rawProduct) => {
		const keys = [
			{ key: 'price' },
			{ key: 'priceType' },
			{
				key: 'name',
				ft: function(el) { return validator.isAscii(el); }
			},
			{
				key: 'description',
				ft: function(el) { return validator.isAscii(el); }
			},
		];

		var safeProduct = checkKeys(keys, rawProduct);
		if (!safeProduct)
			return null;

		if (rawProduct.images instanceof Array) {
			safeProduct.images = [];

			rawProduct.images.forEach(image => { // Check is origin of image
				if (validator.isAlphanumeric(image))
					safeProduct.images.push(image);
			})
		}

		return safeProduct;
	},

	rawUser: (rawUser) => {
		const keys = ['firstName', 'lastName', 'gender', 'userImage', 'currency'];
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
			{ key: 'payment' },
			{ key: 'address' },
		]

		return checkKeys(keys, rawOrder);
	}
}
