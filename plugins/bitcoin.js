const	g =				require('../config/env'),
		axios =			require('axios'),
		bitcoin =		require('bitcoinjs-lib');
		// BitcoinCore =	require('bitcoin-core'),
		// client = 		new BitcoinCore({ network: 'regtest', username: g.bitcoinUser, password: g.bitcoinPassword })

const	network = g.devMode ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

module.exports = {
	createRandomWIF: function(callback) {
		var keyPair = bitcoin.ECPair.makeRandom({ network });
		var wif = keyPair.toWIF();

		callback(wif);
	},

	getLegacyAddress: function(wif, callback) {
		var keyPair = bitcoin.ECPair.fromWIF(wif, network);
		var publicAddress = keyPair.getAddress().toString();

		callback(publicAddress);
	},

	getSegwitAddress: function(wif, callback) {
		var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);
		var pubKey = keyPair.getPublicKeyBuffer();
		var scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey));
		var segwitPublicAddress = bitcoin.address.fromOutputScript(scriptPubKey);

		callback(segwitPublicAddress);
	}
}
