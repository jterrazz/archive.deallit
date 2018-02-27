let env = require('../../../config/env');

const	bitcoin = require('bitcoinjs-lib'),
		network = env.devMode ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

module.exports = {

	/**
	 * Wallet methods
	 */

	createRandomWIF: function() {
		var keyPair = bitcoin.ECPair.makeRandom({
			network
		});
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

	/**
	 * Transaction methods
	 */

	decodeRawTransaction: function(rawtx) {
		rawtx = bitcoin.Transaction.fromHex(rawtx.toString('hex'));
		var tx = {
			id: rawtx.getId(),
			outputs: this.decodeTransactionOutput(rawtx, network),
			inputs: this.decodeTransactionInput(rawtx)
		};
		return tx;
	},

	decodeTransactionOutput: function(tx, network){
		var format = function(out, n, network) {
			var vout = {
				satoshi: out.value,
				value: (1e-8 * out.value).toFixed(8),
				n: n,
				scriptPubKey: {
					asm: bitcoin.script.toASM(out.script),
					hex: out.script.toString('hex'),
					type: bitcoin.script.classifyOutput(out.script),
					addresses: [],
				},
			};
			switch (vout.scriptPubKey.type) {
				case 'pubkeyhash':
				case 'scripthash':
					vout.scriptPubKey.addresses.push(bitcoin.address.fromOutputScript(out.script, network));
					break;
			}
			return vout;
		}

		var result = [];
		tx.outs.forEach(function(out, n) {
			result.push(format(out, n, network));
		})
		return result;
	},

	decodeTransactionInput: function(tx){
	    var result = [];
	    tx.ins.forEach(function(input, n){
	        var vin = {
	            txid: input.hash.reverse().toString('hex'),
	            n : input.index,
	            script: bitcoin.script.toASM(input.script),
	            sequence: input.sequence,
	        }
	        result.push(vin);
	    })
	    return result;
	}
}
