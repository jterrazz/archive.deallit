var localMode = require('./env').localMode;

module.exports = {
	"host": localMode ? "localhost" : "deallit-db-dev.cjysxhddw1lc.eu-west-1.rds.amazonaws.com",
	"port": 3306,
	"user": "admin",
	"password": "Corsica20",
	"database": "deallit_dev",
	"connectionLimit": 100,
	"multipleStatements": true
}
