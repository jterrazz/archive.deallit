const	env =			require('./config/env'),
		cors =			require('cors'),
		pool =			require('./models').pool,
		delay =			require('express-delay'),
		jsonfile =		require('jsonfile'),
		bodyParser =	require('body-parser'),
		responseTime =	require('response-time'),
		camelcaseKeys = require('camelcase-keys'),
		logger =		require('./libs/logger');

const	express =		require('express'),
		app =			express(),
		http =			require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./libs/utils');

/**
 * EXPORT MODE
 */

if (process.env.NODE_ENV == "export") {
	var file = 'exports/categories.json';

	pool.query("SELECT * FROM categories", (err, data) => {
		if (err)
			console.error(err);

		var categoriesJSON = { categories: data };
		jsonfile.writeFile(file, camelcaseKeys(categoriesJSON, {deep: true}), function(err) {
			if (err)
				console.error(err)
			console.log("Exports done");
			return process.exit();
		})
	})
	return;
}

/**
 * DEV MODE
 */

if (env.devMode) {
	app.use(cors());
	app.use(delay(1000 * 0));
	app.use(responseTime((req, res, time) => {
		logger.verbose('\x1b[34m' + req.url.substring(0, 100) + `\x1b[0m (${ time } ms)`);
	}))
}

/**
 * SERVER
 */

const runServer = async () => {
	try {
		await require('./libs/tasks').start();
		require('./routes')(app);

		/**
		 * TEMP Serve files on cloudfront on a CDN
		 */

		app.use(express.static(__dirname + '/public'));
		app.get('*', (req,res) => {
			res.sendFile('index.html', { root: __dirname + '/public' });
		});

		const server = http.listen(env.API_PORT, () => {
			logger.info(`API listening`, { port: server.address().port });
		}).on('error', err => {
			throw err;
		})
	} catch (err) {
		logger.error(err);
		return process.exit();
	}
};

runServer();

/**
 * TODO
 *
 * - Register mail + all system working
 * - Sell form
 * - Modify form
 * - Service bitcoin qui marche inedenpant
 * - Focus sur creer son magasin
 * - Peut etre ethereum
 *
 */

// TODO When selecting user dont select balances and password, ...
// TODO Do pagination for many ... / conversations + redo conversations for products and not user
// TODO:130 Cancel order
// TODO:90 Do store list in home and categories
//
// TODO WHEN buying => log in

/**
 * CODE IMPROVMENTS
 * - Query 2 times user in start ? (/me and /status)
 * - Promisify all sql requests
 * - Tests !!!
 *
 * UI IMPROVMENTS
 * - Better 404 page
 * - 404 for failed ajax requests
 */
