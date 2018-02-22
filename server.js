let		g =				require('./config/env');

const 	bodyParser =	require('body-parser'),
		cors =			require('cors'),
		responseTime =	require('response-time'),
		delay =			require('express-delay');

const	express =		require('express'),
		app =			express(),
		http =			require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* dev only */
if (g.devMode) {
	app.use(cors());
	// app.use(delay(400));
	app.use(responseTime((req, res, time) => {
        console.log('Render ' + req.url.substring(0, 80) + ' (' + time + ' ms)');
	}))
}

require('./routes')(app);

const server = http.listen(g.serverPort, () => {
	console.log("\x1b[32mServer is running on port :\x1b[0m " + server.address().port + " 👍");
	require('./plugins/tasks');
})

//TODO:220 all currency converted server side --> redis store currencies
//TODO:140 Check all routes are number or escaped
//TODO:180 Not found page
//TODO:130 Cancel order
// TODO:90 Do store list in home and categories
// REfactoring routes avec analyse in routes et uniquement db in db
// Optimise Sql request by opening connection for 2 requests
