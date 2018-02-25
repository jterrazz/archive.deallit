const	env =			require('./config/env'),
		cors =			require('cors'),
		pool =			require('./store'),
		delay =			require('express-delay'),
		jsonfile =		require('jsonfile'),
		bodyParser =	require('body-parser'),
		responseTime =	require('response-time'),
		camelcaseKeys = require('camelcase-keys');

const	express =		require('express'),
		app =			express(),
		http =			require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
		console.log(req.url.substring(0, 100) + ` (${ time } ms)`);
	}))
}

/**
 * SERVER
 */

require('./routes')(app);

const server = http.listen(env.API_PORT, () => {
	console.log(`\x1b[32mServer is running on port :\x1b[0m ${ server.address().port } 👍`);
	require('./plugins/tasks');
})

//TODO:220 all currency converted server side --> redis store currencies
//TODO:140 Check all routes are number or escaped
//TODO:180 Not found page
//TODO:130 Cancel order
// TODO:90 Do store list in home and categories
// REfactoring routes avec analyse in routes et uniquement db in db
// Optimise Sql request by opening connection for 2 requests
