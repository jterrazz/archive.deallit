const	env =			require('../../config/env'),
		axios =			require('axios'),
		cacheDB =		require('../redis')
		Events =		require('../events'),
		stats =			require('stats-lite');

// TODO:110 SHOW A PAGE WITH EXCHANGE PRICES
// TODO BETTER RATES FOR BTC AND MULTIPLE SOURCES
var isUpdating = false;

module.exports = {
	getRates: function() {
		return new Promise(function(resolve, reject) {
			cacheDB.get("ticker", async (err, rates) => {
				if (err) return reject(err);

				if (rates) {
					try {
						return resolve(JSON.parse(rates));
					} catch (err) {
						// TODO DELETE KEY
						console.log(err);
					}
				} else if (isUpdating) {
					Events.on('ticker-updated', function(rates) {
						return resolve(rates);
					})
				} else if (!rates) {
					isUpdating = true; // check in case of fail
					var newRates = await queryRates();

					cacheDB.set(`ticker`, JSON.stringify(newRates), 'EX', env.CURRENCY_RATES_UPDATE_DELAY, (err, ret) => {
						isUpdating = false;
						if (err) return reject(err);

						Events.emit('ticker-updated', newRates);
					});
					return resolve(newRates);
				}
			})
		})
	},

	oneToMany: function(priceUSD, priceEUR) {
		return new Promise((resolve, reject) => {
			this.getRates()
				.then(rates => { // TODO DO BETTER (Both prices can be defined)
					if (!priceUSD && !priceEUR)
						return reject("No price provided");
					else if (!priceUSD) {
						return resolve({
							usd: priceEUR / rates.USDEUR,
							eur: priceEUR,
							btc: priceEUR / rates.EURBTC
						})
					} else if (!priceEUR) {
						return resolve({
							usd: priceUSD,
							eur: priceUSD * rates.USDEUR,
							btc: priceUSD / rates.USDBTC
						})
					}
				})
				.catch(err => {
					reject(err);
				})
		});
	}
}

async function queryRates() {
	return new Promise(async function(resolve, reject) {
		var usdbtc = [];
		var eurbtc = [];
		var usdeur = [];

		try {
			var blockchainData = await axios.get("https://blockchain.info/fr/ticker");
			var cmcData = await axios.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR");
			var fixerData = await axios.get("https://api.fixer.io/latest");

			usdbtc.push(blockchainData.data.USD.last, Number(cmcData.data[0].price_usd));
			eurbtc.push(blockchainData.data.EUR.last, Number(cmcData.data[0].price_eur));
			usdeur.push(fixerData.data.rates.USD);

			if (stats.stdev(usdbtc) > 200 || stats.stdev(eurbtc) > 180 || stats.stdev(usdeur) > 0.02)
				throw "Rates too different"

			return resolve({
				USDBTC: stats.mean(usdbtc),
				EURBTC: stats.mean(eurbtc),
				USDEUR: stats.mean(usdeur),
			});
		} catch (err) {
			return reject(err);
		}
	});
}
