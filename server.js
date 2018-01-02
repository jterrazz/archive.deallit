let		g =				require('./config/global')

const 	bodyParser =	require('body-parser'),
		cors =			require('cors'),
		responseTime =	require('response-time')

const	express =		require('express'),
		app =			express(),
		http =			require('http').createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/* dev only */
if (g.devMode) {
	app.use(cors())
	app.use(responseTime((req, res, time) => {
        console.log('Render ' + req.url.substring(0, 80) + ' (' + time + ' ms)')
	}))
}

const routes = require('./routes')
app.use('/api', routes)

const server = http.listen(g.port, () => {
	console.log("\x1b[32mServer is running on port :\x1b[0m " + server.address().port + " 👍")
})
