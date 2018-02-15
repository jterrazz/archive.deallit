const validator =	require('validator')

module.exports = {
	product: (product) => {
		var cleanProduct = {};
		//TODO Handle error returns
		if (!product)
			return null;

		if (product.price)
			cleanProduct.price = product.price; // TODO:160 check is number
		if (product.priceType) // TODO:170 in USD EUR BTC
			cleanProduct.price_type = product.priceType

		if (product.name && !validator.isAscii(product.name))
			return null;
		else if (product.name)
			cleanProduct.name = validator.escape(product.name);

		if (product.description && !validator.isAscii(product.description))
			return null
		else if (product.description)
			cleanProduct.description = validator.escape(product.description);

		if (product.images instanceof Array) {
			cleanProduct.images = []
			product.images.forEach(image => {
				if (validator.isAlphanumeric(image))
					cleanProduct.images.push(image);
			})
		}

		return cleanProduct;
	},

	user: (raw) => {
		var clean = {};

		if (raw.firstName)
			clean.first_name = raw.firstName;
		if (raw.lastName)
			clean.last_name = raw.lastName;
		if (raw.gender)
			clean.gender = raw.gender;
		if (raw.userImage)
			clean.user_image = raw.userImage;
		if (raw.currency) //TODO:50 Check only in list
			clean.currency = raw.currency;

		return clean;
	},

	market: (raw) => {
		var clean = {};

		if (raw.marketBackground)
			clean.market_background = raw.marketBackground;
		if (raw.identifier && validator.isAlpha(raw.identifier))
			clean.market_identifier = raw.identifier; // TODO:30 Check available adn not already set less than 1 month ago

		return clean;
	},

	order: (raw) => {
		var clean = {};

		clean.product_id = raw.productId;
		clean.delivery = raw.delivery;
		clean.payment = raw.payment;

		if (raw.address)
			clean.address = raw.address;

		return clean;
	}
}
