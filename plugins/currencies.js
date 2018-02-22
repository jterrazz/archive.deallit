const	env =			require('../config/env'),
		axios =			require('axios'),
		cacheDB =		require('./caching');

// TODO:170 Do the update after 1 one with timeout + save in local variable
// TODO:110 SHOW A PAGE WITH EXCHANGE PRICES

updateCurrencyRates();
setInterval(updateCurrencyRates, 2 * 1000);

function updateCurrencyRates() {
	cacheDB.get("currency-rates-date", function(err, reply) {
	    if (err)
			return console.log(err);
		if (Date.now() > reply + env.CURRENCY_RATES_UPDATE_DELAY || !reply) {
			cacheDB.set("currency-rates-date", Date.now());

			axios.get("http://apilayer.net/api/live?access_key=4590967ea4c362346e95203c09e14ff2&currencies=EUR,BTC&source=USD")
				.then(ret => {
					cacheDB.set("currency-rates", JSON.stringify(ret.data.quotes));
				})
				.catch(err => {
					console.log(err);
				})
			axios.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR")
				.then(ret => {
					cacheDB.set("currency-crypto-rates", JSON.stringify({ BTCEUR: ret.data[0].price_eur, BTCUSD: ret.data[0].price_usd }));
				})
				.catch(err => {
					console.log(err);
				})
		}
	});
}

// TODO Do more efficient
module.exports = {
	getRates: function() {
		return new Promise(function(resolve, reject) {
			cacheDB.get("currency-rates", (err, reply1) => {
				if (err)
					return reject(err);
				cacheDB.get("currency-crypto-rates", (err, reply2) => {
					if (err)
						return reject(err);
					try {
						var rates = JSON.parse(reply1);
						Object.assign(rates, JSON.parse(reply2));
						return resolve(rates);
					} catch (err) {
						return reject(err);
					}
				})
			})
		});
	},

	oneToMany: function(baseCurrency, priceBase) {
		return new Promise((resolve, reject) => {
			this.getRates()
				.then(rates => {
					switch (baseCurrency) {
						case 'eur':
							return resolve({
								usd: priceBase / rates.USDEUR,
								eur: priceBase,
								btc: priceBase / rates.BTCEUR
							});
							break;
						case 'btc':
							return resolve({
								usd: Number(priceBase * rates.BTCUSD),
								eur: Number(priceBase * rates.BTCEUR),
								btc: priceBase
							});
							break;
						default:
							return resolve({
								usd: priceBase,
								eur: priceBase * rates.USDEUR,
								btc: priceBase / rates.BTCUSD
							});
					}
				})
				.catch(err => {
					reject(err);
				})
		});
	}
}
