/**
 * Created by mega on 15. 9. 14.
 */

/*global process */

var redis = require('redis');
var us = require('underscore');

var HOST	= '192.168.1.201';
var PORT	= 6379;
var rc = redis.createClient(PORT, HOST);

var dbIndex	= 15;
rc.select(dbIndex, function(err, result) {
	if (err) {
		log.error('Redis Connect ERROR: ' + err.message);
		process.exit(1);
		return;
	}

	log.info('Redis Connect OK! result(%s)', result);
});

exports.zincrby = function(key, incrScore, member, callback) {
	rc.zincrby(key, incrScore, member, function(err, curScore) {
		callback(err, curScore);
	});
};

exports.zrevrange = function(key, start, stop, callback) {
	rc.zrevrange(key, start, stop, 'withscores', function(err, result) {
		var lists = us.groupBy(result, function(el, order) {
			return Math.floor(order/2);
		});
		callback(err, us.toArray(lists));
	});
};