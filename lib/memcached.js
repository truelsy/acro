/**
 * Created by mega on 15. 9. 9.
 */

var memcached = require('memcached');

var address = [];
address.push('127.0.0.1:11211');

var mc = new memcached(address);

var expiretime = 60 * 10;    // sec

module.exports = {
	set: function (key, value, callback) {
		mc.set(key, value, expiretime, function (err) {
			callback(err);
		});
	},

	get: function (key, callback) {
		mc.get(key, function (err, value) {
			callback(err, value);
		});
	}
};