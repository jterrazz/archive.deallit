const validator =	require('validator')

module.exports = {
	product: (product) => {
		var cleanProduct = {};

		if (!product)
			return null

		if (product.name && (!validator.isAscii(product.name) || !validator.isLength(product.name, { min: 10, max: 256 })))
			return null
		else if (product.name)
			cleanProduct.name = product.name

		if (product.description && (!validator.isAscii(product.description) || !validator.isLength(product.description, { min: 10, max: 256 })))
			return null
		else if (product.description)
			cleanProduct.description = product.description
			
		return cleanProduct
	}
}
