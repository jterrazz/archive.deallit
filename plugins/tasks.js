const	findRemove =	require('find-remove'),
		env =			require('../config/env');

ftFindRemove();
setInterval(ftFindRemove, 1000 * 60 * 1);

function ftFindRemove(){
	findRemove('uploads', {
		age: {
			seconds: env.TEMP_FILES_MAX_AE
		},
		extensions: ['']
	})
}

module.exports = {}
