var winston = require('winston');
winston.emitErrs = true;

/**
 * DEV: full logs
 * PROD: file
 * TESTS: logs silenced
 */

var transports = [];
if (process.env.NODE_ENV !== 'test') {
	var add = new winston.transports.Console({
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true
	})
	// new winston.transports.File({
	//     level: 'info',
	//     filename: './logs/all-logs.log',
	//     handleExceptions: true,
	//     json: true,
	//     maxsize: 5242880, //5MB
	//     maxFiles: 5,
	//     colorize: false
	// }),

	transports.push(add)
}

var logger = new winston.Logger({
    transports,
    exitOnError: false
});

module.exports = logger;
