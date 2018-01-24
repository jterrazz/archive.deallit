module.exports = {
	images: (toAnalyse) => {
		toAnalyse.forEach((item) => {
			if (item.market_background)
				item.market_background = 'https://s3.eu-west-3.amazonaws.com/the-crypto-market/public/images/' + item.market_background
			if (item.image)
				item.image = 'https://s3.eu-west-3.amazonaws.com/the-crypto-market/public/images/' + item.image
			if (item.user_image)
				item.user_image = 'https://s3.eu-west-3.amazonaws.com/the-crypto-market/public/images/' + item.user_image
			try {
				item.images = JSON.parse(item.images)
				if (item.images){
					item.images.forEach((image, i) => {
						item.images[i] = 'https://s3.eu-west-3.amazonaws.com/the-crypto-market/public/images/' + image
						item.preview = 'https://s3.eu-west-3.amazonaws.com/the-crypto-market/public/images/' + image
					})
				}
			} catch (e) {
				item.images = null
			}
		})
	},

	tags: (toAnalyse) => {
		toAnalyse.forEach(item => {
			if (item.tags)
				item.tags = item.tags.split(',')
			else
				item.tags = []
		})
	},
}
