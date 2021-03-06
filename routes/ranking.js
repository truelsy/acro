/**
 * Created by mega on 15. 9. 14.
 */

/*global mc */

var express = require('express');
var router = express.Router();
var redis = require('../lib/redis');
var sendPacket = require('../lib/sendPacket');
var ack = require('../lib/enum').ack;
var util = require('util');
var async = require('async');

var rankKey = 'RankKey';

var addUserInfo = function (user_seq) {
	return function (callback) {
		var infoQuery = util.format('call sp_select_info_login(%d);', parseInt(user_seq, 10));
		db.execute(infoQuery, function (err, result) {
			var dbResult = result[0][0];
			callback(err, dbResult);
		});
	};
};

var loadRankerFromRedis = function (res) {
	redis.zrevrange(rankKey, 0, 9, function (err, redisResult) {
		if (err) throw err;

		var funcList = [];
		for (var i in redisResult) {
			var user_seq = redisResult[i][0];
			funcList.push(addUserInfo(user_seq));
		}

		// TopRanker의 부가 정보를 병렬로 수행한다.
		async.parallel(funcList, function (err, totalResult) {
			if (err) throw err;

			// Redis에서 조회한 결과에 국가 코드 추가
			for (var i in totalResult) {
				var countryCode = totalResult[i]['country_code'];
				redisResult[i].push(countryCode);
			}

			// 응답
			sendPacket.Send(res, ack.OK, {rank_info: redisResult});

			// TopRanker의 정보를 Memcached에 저장
			mc.set(rankKey, redisResult, function (err) {
				if (err) return;
				log.debug("RankerInfo Memcached Set OK! rankKey(%s) count(%d)", rankKey, redisResult.length);
			});
		}); // async.parallel

	}); // redis.zrevrange
};

router.post('/insert', function (req, res) {
	var user_seq = req.body['user_seq'];
	var score = req.body['score'];

	if (!user_seq || !score) {
		throw new Error('IncrScore Command Arguments is not enough');
	}

	async.waterfall([
			function (callback) {
				redis.zincrby(rankKey, score, user_seq, function (err, curScore) {
					callback(null, curScore);
				});
			},
			function (curScore, callback) {
				redis.zrevrank(rankKey, user_seq, function (err, curRank) {
					callback(null, curScore, curRank);
				});
			}
		],

		function (err, curScore, curRank) {
			if (err) throw err;
			var resJson = {
				cur_score: curScore,
				cur_rank: curRank
			}
			sendPacket.Send(res, ack.OK, resJson);
		}
	);
});


router.post('/top10', function (req, res) {
	mc.get(rankKey, function (err, mcResult) {
		if (!mcResult) {
			loadRankerFromRedis(res);
			return;
		}

		log.info("GetRankerInfo From Memcached. rankerCount(%d)", mcResult.length);

		// 응답
		sendPacket.Send(res, ack.OK, {rank_info: mcResult});
	});
});

router.post('/rank', function (req, res) {
	var user_seq = req.body['user_seq'];

	if (!user_seq) {
		throw new Error('Rank Command Arguments is not enough');
	}

	redis.zrevrank(rankKey, user_seq, function (err, curRank) {
		if (err) throw err;
		sendPacket.Send(res, ack.OK, {cur_rank: curRank});
	});
});

module.exports = router;