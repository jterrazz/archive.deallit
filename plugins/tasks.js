const	findRemove =	require('find-remove');

console.log("\x1b[36m/uploads :\x1b[0m will be cleaned every minutes");
ftFindRemove();
setInterval(ftFindRemove, 1000 * 60 * 1);

function ftFindRemove(){
	findRemove('uploads', {
		age: {
			seconds: 60 * 60
		},
		extensions: ['']
	})
}

module.exports = {}
