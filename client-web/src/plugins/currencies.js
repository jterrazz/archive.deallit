module.exports = {
	getStrPrice: function(userCurrency, prices) {
		switch (userCurrency) {
			case 'eur':
				return `${prices.eur} eur`
				break;
			case 'btc':
				return `${prices.btc} btc`
				break;
			default:
				return `${prices.usd} usd`
		}
	}
}
