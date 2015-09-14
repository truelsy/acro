/**
 * Created by mega on 15. 9. 7.
 */

/*global process */

var mysql = require('mysql');

var pool = mysql.createPool({
    host : "192.168.1.201",
    port : 3306,
    user : "gamevil",
    password : "vlwlrpaqlf",
    database : "acro",
    connectionLimit : 20,
    waitForConnections : true
});

pool.getConnection(function(err, connection) {
	if (err) {
		log.error("Database Connect ERROR(%s)", err.message);
		process.exit(1);
	}

	log.info("Database Connect OK!");
	connection.release();
});


module.exports = {
    execute: function(param, callback) {
      pool.query(param, function(err, result, fields) {
          callback(err, result);
      });
    }
};