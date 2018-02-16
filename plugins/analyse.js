const currenciesPlugin =	require('../plugins/currencies');

module.exports = {
	setNotifications: (notifications) => {
		notifications.forEach(notification => {
			try {
				var params = JSON.parse(notification.params);
			} catch (e) {
				var params = {};
			}
			notification.link = '#'
			switch (notification.type) {
				case 'welcome-1':
					notification.message = "Bienvenue sur my market, commencez des maintenant a vendre vos objects"
					break;
				case 'order-transmitted-1':
					notification.message = `The order of ${ params.order_id } `
					notification.link = `/orders/${ params.order_id }`
					break;
			}
		})
	},

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

	currencies: (products) => {
		return new Promise((resolve, reject) => {
			var ftArray = [];

			products.forEach(product => {
				ftArray.push(currenciesPlugin.oneToMany(product.price_type, product.price));
			})
			Promise.all(ftArray)
				.then(ret => {
					ret.forEach((newPrices, i) => {
						newPrices.usd = Number(newPrices.usd).toFixed(2);
						newPrices.eur = Number(newPrices.eur).toFixed(2);
						newPrices.btc = Number(newPrices.btc).toFixed(2);
						products[i].prices = newPrices;
					})
					return resolve()
				})
				.catch(err => {
					return reject(err);
				})
		});
	}
}
