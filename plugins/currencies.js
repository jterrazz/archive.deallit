const	axios =			require('axios'),
		redis =			require("redis"),
		client =		redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

// TODO Do the update after 1 one with timeout + save in local variable

getCurrencies()
setInterval(getCurrencies, 1000 * 60 * 1);

function getCurrencies() {
	client.get("currency-rates-date", function(err, reply) {
	    if (err)
			return console.log(err);
		if (Date.now() > reply + 60*60*1000 || !reply) {
			client.set("currency-rates-date", Date.now());

			axios.get("http://apilayer.net/api/live?access_key=4590967ea4c362346e95203c09e14ff2&currencies=EUR,BTC&source=USD")
				.then(ret => {
					client.set("currency-rates", JSON.stringify(ret.data.quotes));
				})
				.catch(err => {
					console.log(err);
				})
			axios.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR")
				.then(ret => {
					client.set("currency-crypto-rates", JSON.stringify({ BTCEUR: ret.data[0].price_eur, BTCUSD: ret.data[0].price_usd }));
				})
				.catch(err => {
					console.log(err);
				})

		}
	});
}

module.exports = {
	getRates: function() {
		return new Promise(function(resolve, reject) {
			client.get("currency-rates", (err, reply1) => {
				if (err)
					return reject(err);
				client.get("currency-crypto-rates", (err, reply2) => {
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

	oneToMany: function(currencyBase, priceBase) {
		this.getRates()
			.then(rates => {
				switch (currencyBase) {
					case 'eur':
						return {
							usd: priceBase / rates.USDEUR,
							eur: priceBase,
							btc: priceBase * rates.BTCEUR
						};
						break;
					case 'btc':
						return {
							usd: priceBase / rates.BTCUSD,
							eur: priceBase / rates.BTCEUR,
							btc: priceBase
						};
						break;
					default:
						return {
							usd: priceBase,
							eur: priceBase * rates.USDEUR,
							btc: priceBase * rates.BTCUSD
						};
				}
			})
			.catch(err => {
				console.log(err);
			})
	}
}
