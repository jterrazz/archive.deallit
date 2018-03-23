const	env =			require('../../config/env'),
		axios =			require('axios'),
		redisClient =	require('../redis')
		Events =		require('../events'),
		stats =			require('stats-lite');

// TODO:110 SHOW A PAGE WITH EXCHANGE PRICES
// TODO BETTER RATES FOR BTC AND MULTIPLE SOURCES

var isUpdating = false;
const queryRates = async () => {
	var usdbtc = [];
	var eurbtc = [];
	var usdeur = [];

	var blockchainData = await axios.get("https://blockchain.info/fr/ticker");
	var cmcData = await axios.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR");
	var fixerData = await axios.get("https://api.fixer.io/latest");

	usdbtc.push(blockchainData.data.USD.last, Number(cmcData.data[0].price_usd));
	eurbtc.push(blockchainData.data.EUR.last, Number(cmcData.data[0].price_eur));
	usdeur.push(fixerData.data.rates.USD);

	if (stats.stdev(usdbtc) > 200 || stats.stdev(eurbtc) > 180 || stats.stdev(usdeur) > 0.02)
		throw Error("Rates too different");

	return {
		USDBTC: stats.mean(usdbtc),
		EURBTC: stats.mean(eurbtc),
		USDEUR: stats.mean(usdeur),
	};
}

module.exports = {
	// TODO Simulate delay
	getRates: function() {
		return new Promise(async function(resolve, reject) {
			try {
				var rates = await redisClient.getAsync("ticker");

				if (rates) {
					return resolve(JSON.parse(rates)); // TODO If err reset redis key
				} else if (isUpdating) {
					Events.once('ticker-updated', (rates) => { // TODO ?? Memory leak ?
						return resolve(rates);
					})
				} else {
					isUpdating = true; // check in case of fail
					var newRates = await queryRates();
					await redisClient.setAsync(`ticker`, JSON.stringify(newRates), 'EX', env.CURRENCY_RATES_UPDATE_DELAY);
					isUpdating = false;
					Events.emit('ticker-updated', newRates);
					return resolve(newRates);
				}
			} catch (err) {
				return reject(err);
			}
		});
	},

	// TODO DO BETTER (Both prices can be defined)
	oneToMany: async function(priceUSD, priceEUR) {
		var rates = await this.getRates();

		if (!priceUSD && !priceEUR)
			throw Error("No price provided");
		else if (!priceUSD) {
			return {
				usd: priceEUR / rates.USDEUR,
				eur: priceEUR,
				btc: priceEUR / rates.EURBTC
			}
		} else if (!priceEUR) {
			return {
				usd: priceUSD,
				eur: priceUSD * rates.USDEUR,
				btc: priceUSD / rates.USDBTC
			}
		}
	}
}
