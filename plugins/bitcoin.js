const	g =				require('../config/env'),
		axios =			require('axios'),
		bitcoin =		require('bitcoinjs-lib');
		// BitcoinCore =	require('bitcoin-core'),
		// client = 		new BitcoinCore({ network: 'regtest', username: g.bitcoinNodeUser, password: g.bitcoinUserPassword })

const	network = g.devMode ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

module.exports = {
	createRandomWIF: function() {
		var keyPair = bitcoin.ECPair.makeRandom({ network });
		var wif = keyPair.toWIF();

		return wif;
	},

	getLegacyAddress: function(wif) {
		var keyPair = bitcoin.ECPair.fromWIF(wif, network);
		var publicAddress = keyPair.getAddress().toString();

		return publicAddress;
	},

	getSegwitAddress: function(wif) {
		var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);
		var pubKey = keyPair.getPublicKeyBuffer();
		var scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey));
		var segwitPublicAddress = bitcoin.address.fromOutputScript(scriptPubKey);

		return segwitPublicAddress;
	},

	checkDeposits: function(adresses) {
		axios.get(`https://blockchain.info/fr/balance?active=${ adresses.join('|') }`)
			.then(ret => {
				console.log(ret.data);
			})
			.catch(err => {
				console.log(err);
			})
	}
}
