const	findRemove =	require('find-remove');

ftFindRemove();
setInterval(ftFindRemove, 1000 * 60 * 1);

function ftFindRemove(){
	console.log("\x1b[36mCLEANED DATA :\x1b[0m /uploads");
	findRemove('uploads', {
		age: {
			seconds: 60 * 60
		},
		extensions: ['']
	})
}

module.exports = {}
