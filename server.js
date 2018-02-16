let		g =				require('./config/global')

const 	bodyParser =	require('body-parser'),
		cors =			require('cors'),
		responseTime =	require('response-time'),
		delay =			require('express-delay'),
		auth =			require('./middlewares/auth')

const	express =		require('express'),
		app =			express(),
		http =			require('http').createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(auth.setUser)

/* dev only */
if (g.devMode) {
	app.use(cors())
	// app.use(delay(400))
	app.use(responseTime((req, res, time) => {
        console.log('Render ' + req.url.substring(0, 80) + ' (' + time + ' ms)')
	}))
}

require('./plugins/tasks')

const routes = require('./routes')
app.use('/api', routes)

const server = http.listen(g.port, () => {
	console.log("\x1b[32mServer is running on port :\x1b[0m " + server.address().port + " 👍")
})

//TODO:130 all currency converted server side --> redis store currencies
//TODO:20 Check all routes are number or escaped
//TODO:90 Not found page
//TODO:10 Cancel order
// TODO Do store list in home and categories
// REfactoring routes avec analyse in routes et uniquement db in db
