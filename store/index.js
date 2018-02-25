let		configMysql =	require('../config/mysql.json');

const	mysql =			require('mysql'),
		pool =			mysql.createPool(configMysql);

testConnection();

function testConnection() {
	pool.query('SELECT 1 + 1 AS solution', (err) => {
		if (err && err.code == 'ECONNREFUSED') {
			console.log("Mysql not connected");
			setTimeout(function () {
				testConnection()
			}, 3000);
		} else if (err) {
			console.log(err);
		} else {
			console.log("Connected to Mysql");
		}
	});
};

// TODO UNDERSTAND THIS
pool.ftTransaction = function(body, callback) {
    pool.getConnection(function(err, conn) {
        if (err) return callback(err);

        conn.beginTransaction(function(err) {
            if (err) return done(err);

            body(conn, function(err) {
                // Commit or rollback transaction, then proxy callback
                let args = arguments;

                if (err) {
                    if (err == 'rollback') {
                        args[0] = err = null;
                    }
                    conn.rollback(function() { done.apply(this, args) });
                } else {
                    conn.commit(function(err) {
                        args[0] = err;
                        done.apply(this, args)
                    })
                }
            });

            function done() {
                conn.release();
                callback.apply(this, arguments);
            }
        });
    })
}

module.exports = pool;
