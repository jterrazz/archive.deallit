const env = {
	devMode: process.env.NODE_ENV == "development",

	/* Auth token (time in sec) */
	JWT_TOKEN_DURATION: 60 * 60 * 24,
	SALT_ROUNDS: 10,

	/* AWS */
	AWS_BUCKET_NAME: "the-crypto-market",
	staticServerUrl: "https://s3.eu-west-3.amazonaws.com/the-crypto-market/",

	/* Bitcoin */
	bitcoinUserName: "themaster",
	bitcoinUserPassword: "Corsica20",
	DECIMALS_PRICE_BTC: 5,
}

const devEnv = {
	serverPort: 8081,
	socketPort: 4242,
}

const prodEnv = {
	serverPort: 443,
	socketPort: 442,
}

Object.assign(env, env.devMode ? devEnv : prodEnv);

module.exports = env;
