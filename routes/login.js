/**
 * Created by mega on 15. 9. 7.
 */

/*global mc */

var express = require('express');
var router = express.Router();
var util = require('util');
var sendPacket = require('../lib/sendPacket');
var ack = require('../lib/enum').ack;
var async = require('async');

var loginFromDatabase = function (socialid, countryCode, res) {
	async.waterfall([
			function (callback) {
				var loginQuery = util.format('call sp_info_login(\'%s\', \'%s\');', socialid, countryCode);
				db.execute(loginQuery, function (err, result) {
					callback(err, result);
				});
			},
			function (result, callback) {
				var dbResult = result[0][0];
				if (0 >= dbResult['user_seq']) {
					throw new Error('Invalid UserSeq');
				}

				// Database에서　조회　성공．（결과　전송）
				log.info("GetData From Database. socialid(%s) userInfo(%j)", socialid, JSON.stringify(dbResult));
				sendPacket.Send(res, ack.OK, {user_info: dbResult});

				callback(null, dbResult);
			}
		],

		// Memcached에 유저 정보 저장
		function (err, dbResult) {
			if (err) throw err;

			mc.set(socialid, dbResult, function (err) {
				if (err) {
					log.error("Memcached Set Failed.. socialid(%s)", socialid);
					return;
				}
				log.debug("Memcached Set OK! socialid(%s) userseq(%d)", socialid, dbResult.user_seq);
			});
		});
};


router.post('/', function (req, res) {
	var socialid = req.body['socialid'];
	var countryCode = req.body['country_code'];

	if (!socialid || !socialid.length) {
		throw new Error('Socialid Empty');
	}

	if (!countryCode || !countryCode.length) {
		throw new Error('CountryCode Empty');
	}

	mc.get(socialid, function (err, mcResult) {
		if (!mcResult) {
			loginFromDatabase(socialid, countryCode, res);
			return;
		}

		// 국가코드가 바뀐 경우.
		if (mcResult['country'] !== countryCode) {
			mcResult['country'] = countryCode;

			mc.set(socialid, mcResult, function (err) {
				log.debug("Memcached Set OK! socialid(%s) userseq(%d)", socialid, mcResult.user_seq);
			});
		}

		// Memcached에서　조회　성공．（결과　전송)
		log.info("GetData From Memcached. socialid(%s) userInfo(%j)", socialid, JSON.stringify(mcResult));
		sendPacket.Send(res, ack.OK, {user_info: mcResult});
	});
});

module.exports = router;