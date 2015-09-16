/**
 * Created by mega on 15. 9. 14.
 */

var redis = require('redis');
var _ = require('underscore');

var HOST = '192.168.1.201';
var PORT = 6379;
var rc = redis.createClient(PORT, HOST);

// Redis 접속 성공 이벤트
rc.on('connect', function () {
	log.info('Redis Connect OK.');

	// DatabaseIndex 변경
	var dbIndex = 15;
	rc.select(dbIndex, function (err, result) {
		if (err) {
			log.error('Redis Select ERROR(%s)', err.message);
			process.exit(1);
		}
	});
});

// Redis 접속 실패 이벤트
rc.on('error', function (err) {
	log.error('Redis Connect ERROR(%s)', err.message);
	process.exit(1);
})


// Score 증가
exports.zincrby = function (key, incrScore, member, callback) {
	rc.zincrby(key, incrScore, member, function (err, curScore) {
		callback(err, curScore);
	});
};

// Top10 랭커 추출
exports.zrevrange = function (key, start, stop, callback) {
	rc.zrevrange(key, start, stop, 'withscores', function (err, result) {
		// member, score로 그룹핑
		var lists = _.groupBy(result, function (element, elementIndex) {
			//log.debug("++++ element(%s) elementIndex(%s)", element, elementIndex);
			return Math.floor(elementIndex / 2);
		});
		callback(err, _.toArray(lists));
	});
};