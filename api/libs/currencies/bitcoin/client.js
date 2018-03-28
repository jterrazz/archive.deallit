let env = require('../../../config/env');

const BitcoinCore = require('bitcoin-core');
var config = {
	network: env.devMode ? 'regtest' : 'mainnet',
	username: env.BITCOIN_NODE_USER,
	password: env.BITCOIN_NODE_PASSWORD,
	port: 8333,
};
const client = new BitcoinCore(config)

module.exports = client;
