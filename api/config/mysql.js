var localMode = require('./env').localMode;

module.exports = {
	"host": localMode ? "db" : "deallit-db-dev.cjysxhddw1lc.eu-west-1.rds.amazonaws.com",
	"port": 3306,
	"user": "worker",
	"password": "notsecurepassword",
	"database": "deallit_dev",
	"connectionLimit": 100,
	"multipleStatements": true
}
