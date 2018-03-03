['NODE_ENV'].forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is missing`)
	}
})

const amazonBaseURL = "https://s3.eu-west-3.amazonaws.com/the-crypto-market/";

const env = {
	devMode: process.env.NODE_ENV == "development",
	CURRENCY_RATES_UPDATE_DELAY: 60 * 60, // seconds
	TEMP_FILES_MAX_AGE: 60 * 60, // seconds
	TWO_FA_REGISTER_TIME: 60 * 60 * 2,
	ORDER_VALIDITY: 30,
	SENDGRID_API_KEY: "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",

	/* Auth token (time in sec) */
	JWT_TOKEN_DURATION: 1000 * 60 * 60,
	SALT_ROUNDS: 10,

	/* AWS */
	AWS_BUCKET_NAME: "the-crypto-market",
	staticServerUrl: amazonBaseURL,
	imagesFolder: amazonBaseURL + 'public/images/',

	/* Bitcoin */
	BITCOIN_NODE_USER: "themaster",
	BITCOIN_NODE_PASSWORD: "Corsica20",
}

const devEnv = {
	API_PORT: 8081,
	SOCKET_PORT: 4242,
}

const prodEnv = {
	API_PORT: 443,
	SOCKET_PORT: 442,
}

Object.assign(env, env.devMode ? devEnv : prodEnv);

module.exports = env;
