let env = {
	devMode: true,
	/* Auth token (time in sec) */
	tokenDuration: 60 * 60 * 24,
	saltRounds:	10,
	bitcoinUser: "themaster",
	bitcoinPassword: "Corsica20"
}

env.serverPort = env.devMode ? 8081 : 443;
env.socketPort = env.devMode ? 4242 : 4200;

module.exports = env;
