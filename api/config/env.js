['NODE_ENV'].forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is missing`)
	}
})

let devMode = ["development", "test"].includes(process.env.NODE_ENV);
const amazonBaseURL = devMode ? "https://d2tj4oo7tztmac.cloudfront.net/" : "";

const env = {
	devMode,
	localMode: true,
	webhookOn: false,
	bitcoinTasksOn: false,

	CURRENCY_RATES_UPDATE_DELAY: 60 * 60, // seconds
	TEMP_FILES_MAX_AGE: 60 * 60, // seconds
	TWO_FA_REGISTER_TIME: 60 * 60 * 2,
	ORDER_VALIDITY: 30,
	SENDGRID_API_KEY: "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",

	/* Auth token (time in sec) */
	JWT_TOKEN_DURATION: 1000 * 60 * 60,
	SALT_ROUNDS: 10,

	/* AWS */
	staticServerUrl: amazonBaseURL + 'assets/',
	imagesFolder: amazonBaseURL + 'images/',

	/* Bitcoin */
	BITCOIN_NODE_USER: "themaster",
	BITCOIN_NODE_PASSWORD: "Corsica20",

	BITCOIN_CONFIRMATIONS: 2,
	BITCOIN_MAX_CONFIRMATIONS: 999999999,
	SATOSHI_UNITS: 100000000,

	PREFIX_BITCOIN_UNCONFIRMED_TRANSACTION: "//bitcoin-transaction-unconfirmed:",
	PREFIX_BITCOIN_MONITORED: "//monitoring-bitcoin-address:",
	BITCOIN_MAX_CONFIRMATION_TIME: 60 * 60 * 24,
}

const devEnv = {
	API_PORT: 8081,
	SOCKET_PORT: 4242,
	AWS_BUCKET_NAME: "deallit-dev",
}

const prodEnv = {
	API_PORT: 443,
	SOCKET_PORT: 442,
	AWS_BUCKET_NAME: "deallit-prod",
}

Object.assign(env, env.devMode ? devEnv : prodEnv);

module.exports = env;
