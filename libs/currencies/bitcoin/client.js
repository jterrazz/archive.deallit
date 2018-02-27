let env = require('../../../config/env');

const BitcoinCore = require('bitcoin-core');
const client = new BitcoinCore({
	network: env.devMode ? 'regtest' : 'mainnet',
	username: env.BITCOIN_NODE_USER,
	password: env.BITCOIN_NODE_PASSWORD
})

module.exports = client;
