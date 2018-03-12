Array.prototype.diff = function(arr2) {
	return this.filter(x => !arr2.includes(x));
};

function reflect(promise){
    return promise.then(function(v){ return {v:v, status: "resolved" }},
                        function(e){ return {e: e, status: "rejected" }});
}

Promise.settle = function(promises) {
	return Promise.all(promises.map(reflect))
}
